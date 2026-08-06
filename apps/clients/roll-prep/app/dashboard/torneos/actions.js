"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import {
  buildBracket,
  MATCH_METHODS,
  MAX_GUESTS,
  MAX_GUEST_NAME,
} from "@/libs/tournaments";
import { rollMatch, TOURNAMENT_MODES, OUTFITS, DEFAULT_OUTFIT } from "@/libs/caos";

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

// La base todavía no tiene las columnas de invitados.
function isMissingGuestColumns(error) {
  return error?.code === "42703" || error?.code === "PGRST204";
}

const MISSING_GUESTS_MIGRATION =
  "Falta correr supabase/migrations/20260806140000_tournament_guests.sql " +
  "en el SQL Editor de Supabase.";

/**
 * Crea el tope: sortea a los peleadores seleccionados y genera el bracket
 * completo (los byes de la ronda 1 quedan resueltos de una vez).
 *
 * Un invitado es alguien sin cuenta: se le inventa un uuid aquí mismo y su
 * nombre viaja en la fila de participante. Pelea el bracket completo, pero
 * el XP no lo cobra (lo filtra award_points en la base).
 */
export async function createTournament(formData) {
  const { supabase, user } = await getAdminClient();

  const mode = formData.get("mode") || "classic";
  if (!TOURNAMENT_MODES[mode]) return { error: "Modalidad inválida." };

  const outfit = formData.get("outfit") || DEFAULT_OUTFIT;
  if (!OUTFITS[outfit]) return { error: "Ruleset inválido." };

  const fallbackTitle = mode === "caos" ? "Torneo CAOS" : "Tope interno";
  const title = formData.get("title")?.trim() || fallbackTitle;
  if (title.length > 80) return { error: "El título es muy largo (máx. 80)." };

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

  // Alumnos e invitados entran al sorteo en igualdad de condiciones: lo
  // único que los distingue es de dónde sale el nombre.
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

  const shuffled = shuffle(fighters);

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .insert({ title, mode, outfit, created_by: user.id })
    .select("id")
    .single();

  if (error) return { error: "No se pudo crear el torneo." };

  const { error: participantsError } = await supabase
    .from("tournament_participants")
    .insert(
      shuffled.map((fighter, i) => ({
        tournament_id: tournament.id,
        student_id: fighter.id,
        seed: i + 1,
        is_guest: fighter.isGuest,
        guest_name: fighter.name,
      }))
    );

  if (participantsError) {
    await supabase.from("tournaments").delete().eq("id", tournament.id);
    return {
      error: isMissingGuestColumns(participantsError)
        ? MISSING_GUESTS_MIGRATION
        : "No se pudieron registrar los peleadores.",
    };
  }

  const { error: matchesError } = await supabase
    .from("tournament_matches")
    .insert(
      buildBracket(shuffled.map((fighter) => fighter.id)).map((match) => ({
        ...match,
        tournament_id: tournament.id,
      }))
    );

  if (matchesError) {
    await supabase.from("tournaments").delete().eq("id", tournament.id);
    return { error: "No se pudo generar el bracket." };
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

  if (isMissingGuestColumns(participantsError)) {
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
