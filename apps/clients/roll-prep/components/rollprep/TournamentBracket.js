"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  reportResult,
  undoResult,
  rerollTournament,
  deleteTournament,
  rollMatchChaos,
} from "@/app/dashboard/torneos/actions";
import { MATCH_METHODS, roundName, isBye } from "@/libs/tournaments";
import CaosRollCeremony from "@/components/rollprep/CaosRollCeremony";
import CaosMatchPanel from "@/components/rollprep/CaosMatchPanel";

// Bracket de eliminación simple. Todos lo ven; el profesor (isAdmin) carga
// resultados pelea por pelea, corrige, re-sortea o borra el torneo.
//
// En modalidad CAOS cada pelea lista se rolea antes de pelearse: sale un
// terreno compartido y una carta de duelo partida entre los dos. La
// ceremonia se abre a pantalla completa (y se puede repetir para grabarla).
export default function TournamentBracket({
  tournament,
  matches,
  names,
  isAdmin,
  rolls = {},
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openMatchId, setOpenMatchId] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [method, setMethod] = useState(null);
  // Roll que se está mostrando a pantalla completa, con sus dos peleadores.
  const [ceremony, setCeremony] = useState(null);
  const [rollingMatchId, setRollingMatchId] = useState(null);

  const isCaos = tournament.mode === "caos";
  const isActive = tournament.status === "active";
  const hasResults = matches.some((m) => m.method !== null);

  const rounds = [...new Set(matches.map((m) => m.round))]
    .sort((a, b) => a - b)
    .map((round) => ({
      round,
      matches: matches
        .filter((m) => m.round === round)
        .sort((a, b) => a.slot - b.slot),
    }));

  const finalMatch = rounds.length
    ? rounds[rounds.length - 1].matches[0]
    : null;
  const championName =
    tournament.status === "completed" && finalMatch?.winner_id
      ? names[finalMatch.winner_id]
      : null;

  const run = (action, successMessage, onDone) => {
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (successMessage) toast.success(successMessage);
      onDone?.();
    });
  };

  const openResultPanel = (match) => {
    setOpenMatchId(match.id);
    setWinnerId(null);
    setMethod(null);
  };

  const saveResult = (match) => {
    if (!winnerId || !method) {
      toast.error("Elige ganador y cómo terminó.");
      return;
    }
    run(() => reportResult(match.id, winnerId, method), "Resultado guardado 🥋", () =>
      setOpenMatchId(null)
    );
  };

  const handleReroll = () => {
    if (!window.confirm("¿Re-sortear el bracket con los mismos peleadores?")) return;
    run(() => rerollTournament(tournament.id), "Bracket re-sorteado 🎲");
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        "¿Borrar este torneo? Se pierde el bracket y se retiran los puntos que haya repartido."
      )
    )
      return;
    run(() => deleteTournament(tournament.id), "Torneo borrado", () =>
      router.push("/dashboard/torneos")
    );
  };

  const handleUndo = (match) => {
    if (!window.confirm("¿Borrar el resultado de esta pelea?")) return;
    run(() => undoResult(match.id), "Resultado corregido");
  };

  // Rolea (o re-rolea) el CAOS de una pelea y abre la ceremonia de una vez
  // con el resultado que devolvió el servidor.
  const handleRoll = (match) => {
    if (rolls[match.id] && !window.confirm("¿Volver a rolear esta pelea?")) return;

    setRollingMatchId(match.id);
    startTransition(async () => {
      const result = await rollMatchChaos(match.id);
      setRollingMatchId(null);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      setCeremony({
        roll: result.roll,
        student1Id: match.student1_id,
        student2Id: match.student2_id,
      });
    });
  };

  const openCeremony = (match) =>
    setCeremony({
      roll: rolls[match.id],
      student1Id: match.student1_id,
      student2Id: match.student2_id,
    });

  return (
    <div className="space-y-4">
      {ceremony && (
        <CaosRollCeremony
          roll={ceremony.roll}
          student1Id={ceremony.student1Id}
          student2Id={ceremony.student2Id}
          names={names}
          outfit={tournament.outfit}
          onClose={() => setCeremony(null)}
        />
      )}
      {championName && (
        <div className="rise rise-2 clip-cut border-2 border-primary bg-primary/10 p-5 text-center">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-primary">
            Campeón del tope
          </p>
          <p className="display mt-1 text-4xl">{championName}</p>
        </div>
      )}

      {isAdmin && (
        <div className="rise rise-2 flex flex-wrap items-center gap-2 border border-base-300 bg-base-200 p-3">
          <span className="tag-skew bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content">
            <span>Coach mode</span>
          </span>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-60">
            {!isActive
              ? "Torneo finalizado"
              : isCaos
                ? "Rolea cada pelea y después carga el resultado"
                : "Toca una pelea para cargar el resultado"}
          </p>
          <div className="ml-auto flex gap-2">
            {isActive && !hasResults && (
              <button
                type="button"
                className="btn btn-outline btn-xs uppercase"
                onClick={handleReroll}
                disabled={isPending}
              >
                Re-sortear 🎲
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline btn-error btn-xs uppercase"
              onClick={handleDelete}
              disabled={isPending}
            >
              Borrar
            </button>
          </div>
        </div>
      )}

      <div className="rise rise-3 overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {rounds.map(({ round, matches: roundMatches }) => (
            <div key={round} className="flex w-60 flex-col">
              <p className="mb-3 text-center text-[0.65rem] font-black uppercase tracking-[0.25em] opacity-60">
                {roundName(roundMatches.length)}
              </p>

              <div className="flex flex-1 flex-col justify-around gap-3">
                {roundMatches.map((match) => {
                  const bye = isBye(match);
                  const decided = Boolean(match.winner_id);
                  const ready =
                    Boolean(match.student1_id) && Boolean(match.student2_id);
                  const isOpen = openMatchId === match.id;
                  const roll = isCaos ? rolls[match.id] : null;
                  // En el CAOS no se carga resultado sin haber roleado.
                  const canReport = !isCaos || Boolean(roll);

                  return (
                    <div
                      key={match.id}
                      className={`clip-cut border-2 bg-base-200 ${
                        decided && !bye
                          ? "border-base-300"
                          : ready
                            ? "border-primary/50"
                            : "border-base-300 opacity-80"
                      }`}
                    >
                      <PlayerRow
                        name={match.student1_id ? names[match.student1_id] : null}
                        isWinner={decided && match.winner_id === match.student1_id}
                        isLoser={decided && !bye && match.winner_id !== match.student1_id}
                      />
                      <div className="border-t border-base-300" />
                      <PlayerRow
                        name={match.student2_id ? names[match.student2_id] : null}
                        isWinner={decided && match.winner_id === match.student2_id}
                        isLoser={decided && !bye && match.winner_id !== match.student2_id}
                        placeholder={bye ? "Pase directo" : "Por definir"}
                      />

                      {(match.method || bye || ready) && (
                        <div className="flex items-center gap-2 border-t border-base-300 px-3 py-1.5">
                          {bye ? (
                            <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                              Sin pelea
                            </span>
                          ) : match.method ? (
                            <span className="tag-skew bg-secondary px-1.5 py-0.5 text-[0.55rem] text-secondary-content">
                              <span>{MATCH_METHODS[match.method]}</span>
                            </span>
                          ) : (
                            <span
                              className={`blink-soft text-[0.6rem] font-bold uppercase tracking-widest ${
                                canReport ? "text-primary" : "text-accent"
                              }`}
                            >
                              {canReport ? "Lista para pelear" : "Falta rolear"}
                            </span>
                          )}

                          {isAdmin && !bye && ready && (
                            <span className="ml-auto">
                              {decided ? (
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-xs uppercase opacity-60 hover:opacity-100"
                                  onClick={() => handleUndo(match)}
                                  disabled={isPending}
                                >
                                  Corregir
                                </button>
                              ) : (
                                isActive &&
                                canReport && (
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-xs uppercase"
                                    onClick={() =>
                                      isOpen
                                        ? setOpenMatchId(null)
                                        : openResultPanel(match)
                                    }
                                    disabled={isPending}
                                  >
                                    {isOpen ? "Cerrar" : "Resultado"}
                                  </button>
                                )
                              )}
                            </span>
                          )}
                        </div>
                      )}

                      {/* CAOS: el roleo de la pelea y sus cartas */}
                      {roll && (
                        <CaosMatchPanel
                          roll={roll}
                          student1Id={match.student1_id}
                          student2Id={match.student2_id}
                          names={names}
                          onOpen={() => openCeremony(match)}
                        />
                      )}

                      {isCaos && isAdmin && isActive && ready && !bye && !decided && (
                        <div className="border-t-2 border-base-300 px-2 pb-4 pt-2">
                          <button
                            type="button"
                            className={`btn btn-xs btn-block uppercase ${
                              roll ? "btn-ghost opacity-70" : "btn-accent"
                            }`}
                            onClick={() => handleRoll(match)}
                            disabled={isPending}
                          >
                            {rollingMatchId === match.id ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : null}
                            {roll ? "Re-rolear" : "Rolear el CAOS 🎲"}
                          </button>
                        </div>
                      )}

                      {isAdmin && isOpen && !decided && ready && (
                        <div className="space-y-3 border-t-2 border-primary bg-base-100 p-3">
                          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
                            ¿Quién ganó?
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {[match.student1_id, match.student2_id].map((id) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setWinnerId(id)}
                                className={`btn btn-xs justify-start truncate normal-case ${
                                  winnerId === id ? "btn-primary" : "btn-outline"
                                }`}
                              >
                                {names[id]}
                              </button>
                            ))}
                          </div>

                          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
                            ¿Cómo terminó?
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(MATCH_METHODS).map(([key, label]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setMethod(key)}
                                className={`btn btn-xs normal-case ${
                                  method === key ? "btn-secondary" : "btn-outline"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm btn-block uppercase"
                            onClick={() => saveResult(match)}
                            disabled={isPending || !winnerId || !method}
                          >
                            {isPending && (
                              <span className="loading loading-spinner loading-xs" />
                            )}
                            Guardar resultado
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ name, isWinner, isLoser, placeholder = "Por definir" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span
        className={`truncate text-sm ${
          isWinner
            ? "font-black text-primary"
            : isLoser
              ? "font-semibold opacity-40 line-through"
              : name
                ? "font-semibold"
                : "italic opacity-40"
        }`}
      >
        {name ?? placeholder}
      </span>
      {isWinner && (
        <span className="ml-auto shrink-0 text-[0.6rem] font-black uppercase tracking-widest text-primary">
          Win
        </span>
      )}
    </div>
  );
}
