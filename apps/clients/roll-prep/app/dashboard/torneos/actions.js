"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import {
  buildBracket,
  MATCH_METHODS,
  MAX_GUESTS,
  MAX_GUEST_NAME,
  TOURNAMENT_SCHEDULE_MIGRATION,
  isMissingSchedule,
} from "@/libs/tournaments";
import {
  rollMatch,
  TOURNAMENT_MODES,
  OUTFITS,
  DEFAULT_OUTFIT,
  EVENT_TYPES,
  DEFAULT_EVENT_TYPE,
  CAOS_RANKING_MIGRATION,
} from "@/libs/caos";
import { parseDateInput } from "@/libs/rollprep";

async function getAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Solo el profesor puede hacer esto");
  }

  return { supabase, user };
}

function revalidateTournamentPaths(tournamentId) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/torneos");
  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/ranking");
  revalidatePath("/dashboard/ranking/caos");
  revalidatePath("/dashboard/calendario");
  if (tournamentId) revalidatePath(`/dashboard/torneos/${tournamentId}`);
}

function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// La base todavía no tiene alguna columna de una migración reciente
// (invitados, tipo de evento...). El mensaje dice cuál falta según el caso.
function isMissingColumn(error) {
  return error?.code === "42703" || error?.code === "PGRST204";
}

const MISSING_GUESTS_MIGRATION =
  "Falta correr supabase/migrations/20260806140000_tournament_guests.sql " +
  "en el SQL Editor de Supabase.";

const MISSING_RANKING_MIGRATION =
  `Falta correr ${CAOS_RANKING_MIGRATION} en el SQL Editor de Supabase.`;

const MISSING_SCHEDULE_MIGRATION =
  `Falta correr ${TOURNAMENT_SCHEDULE_MIGRATION} en el SQL Editor de Supabase.`;

function parseFighters(formData) {
  const studentIds = [...new Set(formData.getAll("student_ids"))].filter(Boolean);

  const guestNames = formData
    .getAll("guest_names")
    .map((name) => String(name).trim())
    .filter(Boolean);

  if (guestNames.length > MAX_GUESTS) {
    return { error: `Máximo ${MAX_GUESTS} invitados.` };
  }
  if (guestNames.some((name) => name.length > MAX_GUEST_NAME)) {
    return { error: `Un nombre de invitado es muy largo (máx. ${MAX_GUEST_NAME}).` };
  }

  const fighters = [
    ...studentIds.map((id) => ({ id, isGuest: false, name: null })),
    ...guestNames.map((name) => ({
      id: crypto.randomUUID(),
      isGuest: true,
      name,
    })),
  ];

  if (fighters.length < 2) {
    return { error: "Se necesitan al menos 2 peleadores." };
  }

  return { fighters };
}

async function fillBracket(supabase, tournamentId, fighters) {
  const shuffled = shuffle(fighters);

  const { error: participantsError } = await supabase
    .from("tournament_participants")
    .insert(
      shuffled.map((fighter, i) => ({
        tournament_id: tournamentId,
        student_id: fighter.id,
        seed: i + 1,
        is_guest: fighter.isGuest,
        guest_name: fighter.name,
      }))
    );

  if (participantsError) {
    return {
      error: isMissingColumn(participantsError)
        ? MISSING_GUESTS_MIGRATION
        : "No se pudieron registrar los peleadores.",
    };
  }

  const { error: matchesError } = await supabase
    .from("tournament_matches")
    .insert(
      buildBracket(shuffled.map((fighter) => fighter.id)).map((match) => ({
        ...match,
        tournament_id: tournamentId,
      }))
    );

  if (matchesError) {
    await supabase
      .from("tournament_participants")
      .delete()
      .eq("tournament_id", tournamentId);
    return { error: "No se pudo generar el bracket." };
  }

  return { success: true };
}

/**
 * Crea el tope.
 *
 * Tope de clase (clásico o CAOS): sortea a los peleadores seleccionados y
 * genera el bracket de una vez. La fecha es hoy en la zona del gym.
 *
 * Circuito CAOS: solo fecha (hoy si no se especifica) y el cascarón del
 * evento. Sin peleadores. El día del evento el profesor entra y sortea.
 * Siempre es modalidad CAOS: el circuito no se pelea con reglas clásicas.
 *
 * Un invitado es alguien sin cuenta: se le inventa un uuid aquí mismo y su
 * nombre viaja en la fila de participante. Pelea el bracket completo, pero
 * el XP no lo cobra (lo filtra award_points en la base).
 */
export async function createTournament(formData) {
  const { supabase, user } = await getAdminClient();

  let mode = formData.get("mode") || "classic";
  if (!TOURNAMENT_MODES[mode]) return { error: "Modalidad inválida." };

  const outfit = formData.get("outfit") || DEFAULT_OUTFIT;
  if (!OUTFITS[outfit]) return { error: "Ruleset inválido." };

  // De clase o del circuito. Los dos suman al ranking CAOS; el tipo es lo
  // que después deja mirarlos por separado.
  let eventType = formData.get("event_type") || DEFAULT_EVENT_TYPE;
  if (!EVENT_TYPES[eventType]) return { error: "Tipo de evento inválido." };

  // El circuito siempre es CAOS. Si alguien manda clásico + circuito,
  // gana el circuito: no hay viernes "clásico oficial" todavía.
  if (eventType === "circuit") mode = "caos";
  if (mode !== "caos") eventType = "class";

  // Un bracket de prueba no debería ensuciar el ranking.
  const ranked = formData.get("ranked") !== "off";

  const fallbackTitle =
    eventType === "circuit"
      ? "Circuito CAOS"
      : mode === "caos"
        ? "Torneo CAOS"
        : "Tope interno";
  const title = formData.get("title")?.trim() || fallbackTitle;
  if (title.length > 80) return { error: "El título es muy largo (máx. 80)." };

  const scheduledFor = parseDateInput(formData.get("scheduled_for"));
  if (!scheduledFor) return { error: "Fecha inválida." };

  const row = {
    title,
    mode,
    outfit,
    event_type: eventType,
    ranked,
    scheduled_for: scheduledFor,
    created_by: user.id,
  };

  // Circuito: se anuncia con fecha y el bracket se arma el día de.
  if (eventType === "circuit") {
    const { data: tournament, error } = await supabase
      .from("tournaments")
      .insert({ ...row, status: "scheduled" })
      .select("id")
      .single();

    if (error) {
      return {
        error: isMissingSchedule(error)
          ? MISSING_SCHEDULE_MIGRATION
          : isMissingColumn(error)
            ? MISSING_RANKING_MIGRATION
            : "No se pudo crear el evento.",
      };
    }

    revalidateTournamentPaths(tournament.id);
    return { success: true, id: tournament.id, scheduled: true };
  }

  const parsed = parseFighters(formData);
  if (parsed.error) return parsed;

  const { data: tournament, error } = await insertClassTournament(supabase, row);

  if (error) {
    return {
      error: isMissingColumn(error)
        ? MISSING_RANKING_MIGRATION
        : "No se pudo crear el torneo.",
    };
  }

  const filled = await fillBracket(supabase, tournament.id, parsed.fighters);
  if (filled.error) {
    await supabase.from("tournaments").delete().eq("id", tournament.id);
    return filled;
  }

  revalidateTournamentPaths(tournament.id);
  return { success: true, id: tournament.id };
}

// El tope de clase tiene que seguir funcionando aunque aún no se haya
// corrido la migración de la fecha: se reintenta sin scheduled_for.
async function insertClassTournament(supabase, row) {
  const first = await supabase.from("tournaments").insert(row).select("id").single();
  if (!isMissingSchedule(first.error)) return first;

  const { scheduled_for: _scheduledFor, ...rest } = row;
  return supabase.from("tournaments").insert(rest).select("id").single();
}

/**
 * El día del circuito: marca quién pelea y sortea el bracket. Solo sobre
 * un evento que todavía está programado (sin peleadores).
 */
export async function seedTournament(formData) {
  const { supabase } = await getAdminClient();

  const tournamentId = formData.get("tournament_id");
  if (!tournamentId) return { error: "Falta el id del torneo." };

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select("id, status, mode, event_type")
    .eq("id", tournamentId)
    .maybeSingle();

  if (error) {
    return {
      error: isMissingSchedule(error)
        ? MISSING_SCHEDULE_MIGRATION
        : "No se pudo leer el evento.",
    };
  }
  if (!tournament) return { error: "Evento no encontrado." };
  if (tournament.event_type !== "circuit" || tournament.mode !== "caos") {
    return { error: "Solo se sortea así un evento del circuito CAOS." };
  }
  if (tournament.status !== "scheduled") {
    return { error: "Este evento ya tiene bracket." };
  }

  const parsed = parseFighters(formData);
  if (parsed.error) return parsed;

  const filled = await fillBracket(supabase, tournament.id, parsed.fighters);
  if (filled.error) return filled;

  const { error: statusError } = await supabase
    .from("tournaments")
    .update({ status: "active" })
    .eq("id", tournament.id);

  if (statusError) {
    await supabase
      .from("tournament_participants")
      .delete()
      .eq("tournament_id", tournament.id);
    await supabase
      .from("tournament_matches")
      .delete()
      .eq("tournament_id", tournament.id);
    return { error: "No se pudo abrir el bracket." };
  }

  revalidateTournamentPaths(tournament.id);
  return { success: true, id: tournament.id };
}

/**
 * Re-sortea el bracket con los mismos peleadores. Solo mientras no haya
 * ningún resultado cargado (los byes no cuentan: no tienen method).
 */
export async function rerollTournament(tournamentId) {
  const { supabase } = await getAdminClient();

  if (!tournamentId) return { error: "Falta el id del torneo." };

  const { count } = await supabase
    .from("tournament_matches")
    .select("id", { count: "exact", head: true })
    .eq("tournament_id", tournamentId)
    .not("method", "is", null);

  if (count > 0) {
    return { error: "Ya hay resultados cargados: no se puede re-sortear." };
  }

  const { data: participants, error: participantsError } = await supabase
    .from("tournament_participants")
    .select("student_id, is_guest, guest_name")
    .eq("tournament_id", tournamentId);

  if (isMissingColumn(participantsError)) {
    return { error: MISSING_GUESTS_MIGRATION };
  }

  if (!participants || participants.length < 2) {
    return { error: "El torneo no tiene suficientes peleadores." };
  }

  const shuffled = shuffle(participants);

  // El upsert reescribe la fila entera: si no viajan los datos del invitado
  // se perdería su nombre en el re-sorteo.
  const { error: seedError } = await supabase
    .from("tournament_participants")
    .upsert(
      shuffled.map((participant, i) => ({
        ...participant,
        tournament_id: tournamentId,
        seed: i + 1,
      }))
    );

  if (seedError) return { error: "No se pudo re-sortear." };

  const { error: deleteError } = await supabase
    .from("tournament_matches")
    .delete()
    .eq("tournament_id", tournamentId);

  if (deleteError) return { error: "No se pudo re-sortear." };

  const { error: matchesError } = await supabase
    .from("tournament_matches")
    .insert(
      buildBracket(shuffled.map((p) => p.student_id)).map((match) => ({
        ...match,
        tournament_id: tournamentId,
      }))
    );

  if (matchesError) return { error: "No se pudo regenerar el bracket." };

  revalidateTournamentPaths(tournamentId);
  return { success: true };
}

/**
 * Borra el torneo completo (era de prueba). El trigger en la DB retira
 * cualquier punto que se hubiera otorgado.
 */
export async function deleteTournament(tournamentId) {
  const { supabase } = await getAdminClient();

  if (!tournamentId) return { error: "Falta el id del torneo." };

  const { error } = await supabase
    .from("tournaments")
    .delete()
    .eq("id", tournamentId);

  if (error) return { error: "No se pudo borrar el torneo." };

  revalidateTournamentPaths(tournamentId);
  return { success: true };
}

/**
 * Carga el resultado de una pelea y avanza al ganador a la siguiente ronda.
 * Si era la final, marca el torneo como completado (el trigger de la DB
 * reparte los puntos: participación, finalista y campeón).
 */
export async function reportResult(matchId, winnerId, method) {
  const { supabase } = await getAdminClient();

  if (!MATCH_METHODS[method]) return { error: "Método inválido." };

  const { data: match } = await supabase
    .from("tournament_matches")
    .select("id, tournament_id, round, slot, student1_id, student2_id, winner_id")
    .eq("id", matchId)
    .maybeSingle();

  if (!match) return { error: "Pelea no encontrada." };
  if (match.winner_id) return { error: "Esta pelea ya tiene resultado." };
  if (!match.student1_id || !match.student2_id) {
    return { error: "La pelea aún no tiene los dos peleadores." };
  }
  if (winnerId !== match.student1_id && winnerId !== match.student2_id) {
    return { error: "El ganador no está en esta pelea." };
  }

  // En el CAOS no se pelea sin cartas: primero se rolea.
  const { data: tournamentMode } = await supabase
    .from("tournaments")
    .select("mode")
    .eq("id", match.tournament_id)
    .maybeSingle();

  if (tournamentMode?.mode === "caos") {
    const { data: roll } = await supabase
      .from("tournament_match_rolls")
      .select("match_id")
      .eq("match_id", matchId)
      .maybeSingle();

    if (!roll) return { error: "Primero hay que rolear el CAOS de esta pelea." };
  }

  const { error } = await supabase
    .from("tournament_matches")
    .update({
      winner_id: winnerId,
      method,
      decided_at: new Date().toISOString(),
    })
    .eq("id", matchId);

  if (error) return { error: "No se pudo guardar el resultado." };

  const { data: next } = await supabase
    .from("tournament_matches")
    .select("id")
    .eq("tournament_id", match.tournament_id)
    .eq("round", match.round + 1)
    .eq("slot", Math.floor(match.slot / 2))
    .maybeSingle();

  if (next) {
    await supabase
      .from("tournament_matches")
      .update(
        match.slot % 2 === 0
          ? { student1_id: winnerId }
          : { student2_id: winnerId }
      )
      .eq("id", next.id);
  } else {
    // Era la final: el torneo queda completado y la DB reparte los puntos.
    await supabase
      .from("tournaments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", match.tournament_id);
  }

  revalidateTournamentPaths(match.tournament_id);
  return { success: true };
}

/**
 * Corrige (borra) el resultado de una pelea. Solo si la pelea de la
 * siguiente ronda no se decidió todavía. Si era la final, el torneo se
 * reabre y la DB retira los puntos repartidos.
 */
export async function undoResult(matchId) {
  const { supabase } = await getAdminClient();

  const { data: match } = await supabase
    .from("tournament_matches")
    .select("id, tournament_id, round, slot, student1_id, student2_id, winner_id")
    .eq("id", matchId)
    .maybeSingle();

  if (!match) return { error: "Pelea no encontrada." };
  if (!match.winner_id) return { error: "Esta pelea no tiene resultado." };
  if (!match.student1_id || !match.student2_id) {
    return { error: "Un pase directo no se puede corregir." };
  }

  const { data: next } = await supabase
    .from("tournament_matches")
    .select("id, winner_id")
    .eq("tournament_id", match.tournament_id)
    .eq("round", match.round + 1)
    .eq("slot", Math.floor(match.slot / 2))
    .maybeSingle();

  if (next) {
    if (next.winner_id) {
      return { error: "Primero corrige la pelea de la siguiente ronda." };
    }
    await supabase
      .from("tournament_matches")
      .update(
        match.slot % 2 === 0 ? { student1_id: null } : { student2_id: null }
      )
      .eq("id", next.id);
  } else {
    // Era la final: reabrir el torneo retira los puntos (trigger en la DB).
    await supabase
      .from("tournaments")
      .update({ status: "active", completed_at: null })
      .eq("id", match.tournament_id);
  }

  const { error } = await supabase
    .from("tournament_matches")
    .update({ winner_id: null, method: null, decided_at: null })
    .eq("id", matchId);

  if (error) return { error: "No se pudo corregir el resultado." };

  revalidateTournamentPaths(match.tournament_id);
  return { success: true };
}

/**
 * TORNEO CAOS — rolea (o re-rolea) los modificadores de una pelea: un
 * terreno compartido y una carta de duelo partida entre los dos peleadores.
 *
 * Solo se puede rolear si la pelea tiene los dos peleadores y todavía no
 * tiene resultado. Devuelve el roll para que el cliente lo anime de una vez,
 * sin esperar a que la página revalide.
 */
export async function rollMatchChaos(matchId) {
  const { supabase, user } = await getAdminClient();

  if (!matchId) return { error: "Falta el id de la pelea." };

  const { data: match } = await supabase
    .from("tournament_matches")
    .select("id, tournament_id, student1_id, student2_id, winner_id")
    .eq("id", matchId)
    .maybeSingle();

  if (!match) return { error: "Pelea no encontrada." };
  if (!match.student1_id || !match.student2_id) {
    return { error: "La pelea aún no tiene los dos peleadores." };
  }
  if (match.winner_id) {
    return { error: "Esta pelea ya se peleó: el CAOS queda como quedó." };
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("id, mode, outfit, status")
    .eq("id", match.tournament_id)
    .maybeSingle();

  if (tournament?.mode !== "caos") {
    return { error: "Este torneo no es de modalidad CAOS." };
  }
  if (tournament.status !== "active") {
    return { error: "El torneo ya está finalizado." };
  }

  // El mazo se arma con el ruleset del torneo: gi y no-gi no comparten
  // todas las cartas.
  const roll = rollMatch(tournament.outfit);

  const { error } = await supabase.from("tournament_match_rolls").upsert({
    match_id: match.id,
    tournament_id: match.tournament_id,
    ...roll,
    rolled_at: new Date().toISOString(),
    rolled_by: user.id,
  });

  if (error) return { error: "No se pudo rolear el CAOS." };

  revalidateTournamentPaths(match.tournament_id);
  return { success: true, roll: { match_id: match.id, ...roll } };
}
