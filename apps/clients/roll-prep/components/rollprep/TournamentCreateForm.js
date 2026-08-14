"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  createTournament,
  seedTournament,
  deleteTournament,
} from "@/app/dashboard/torneos/actions";
import CaosMark from "@/components/rollprep/CaosMark";
import {
  CAOS_POINTS,
  OUTFITS,
  DEFAULT_OUTFIT,
  deckFor,
  EVENT_TYPES,
  DEFAULT_EVENT_TYPE,
} from "@/libs/caos";
import {
  randomGuestName,
  randomGuestNames,
  MAX_GUESTS,
  MAX_GUEST_NAME,
} from "@/libs/tournaments";

// Formulario del profesor para armar un tope.
//
// Dos caminos, a propósito distintos:
//
//   CLASE (clásico o CAOS) — quién está hoy en el tatami, invitados si
//   cayeron, y se sortea ya. La fecha es hoy.
//
//   CIRCUITO CAOS — solo la fecha (hoy si no se toca, o una específica).
//   Sin peleadores. El día del evento se entra a la ficha y se sortea.
//
// `seed` convierte el mismo formulario en el paso 2 del circuito: marca
// quién pelea sobre un evento que ya existe.
export default function TournamentCreateForm({
  students,
  todayKey,
  seed = null,
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(
    () => (seed ? new Set() : new Set(students.map((s) => s.id)))
  );
  const [mode, setMode] = useState(seed ? "caos" : "classic");
  const [outfit, setOutfit] = useState(DEFAULT_OUTFIT);
  const [eventType, setEventType] = useState(
    seed ? "circuit" : DEFAULT_EVENT_TYPE
  );
  const [ranked, setRanked] = useState(true);
  const [specifyDate, setSpecifyDate] = useState(false);
  const [eventDate, setEventDate] = useState(todayKey ?? "");
  const [hasGuests, setHasGuests] = useState(null);
  const [guests, setGuests] = useState([]);
  const [isPending, startTransition] = useTransition();
  const deck = deckFor(outfit);

  const isSeed = Boolean(seed?.id);
  const isCircuit = !isSeed && mode === "caos" && eventType === "circuit";
  const needsRoster = isSeed || !isCircuit;

  const pickMode = (next) => {
    setMode(next);
    if (next === "classic") setEventType("class");
  };

  const pickEventType = (next) => {
    setEventType(next);
    if (next === "circuit") setMode("caos");
  };

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Cuántos invitados hay. Al subir la cifra se inventan los que faltan; al
  // bajarla se cortan los últimos (los nombres ya editados no se pierden).
  const setGuestCount = (raw) => {
    const count = Math.max(0, Math.min(MAX_GUESTS, Number(raw) || 0));
    setGuests((prev) => {
      if (count <= prev.length) return prev.slice(0, count);
      return [...prev, ...randomGuestNames(count - prev.length, prev)];
    });
  };

  const renameGuest = (index, name) =>
    setGuests((prev) => prev.map((g, i) => (i === index ? name : g)));

  const rerollGuest = (index) =>
    setGuests((prev) =>
      prev.map((g, i) =>
        i === index ? randomGuestName(prev.filter((_, j) => j !== i)) : g
      )
    );

  const rerollAllGuests = () =>
    setGuests((prev) => randomGuestNames(prev.length));

  const answerGuests = (yes) => {
    setHasGuests(yes);
    if (yes) setGuests((prev) => (prev.length ? prev : randomGuestNames(1)));
    else setGuests([]);
  };

  const allSelected = selected.size === students.length;
  const guestCount = hasGuests ? guests.length : 0;
  const totalFighters = selected.size + guestCount;
  const canSubmit = isCircuit || totalFighters >= 2;

  const handleSubmit = (formData) => {
    if (needsRoster && hasGuests && guests.some((g) => !g.trim())) {
      toast.error("Hay un invitado sin nombre.");
      return;
    }

    startTransition(async () => {
      const result = isSeed
        ? await seedTournament(formData)
        : await createTournament(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        result?.scheduled
          ? "Evento en el calendario 📅"
          : "¡Bracket sorteado! 🥋"
      );
      router.push(`/dashboard/torneos/${result.id}`);
    });
  };

  const handleDeleteSeed = () => {
    if (
      !window.confirm(
        "¿Borrar este evento? Todavía no tiene bracket, no se pierde ningún resultado."
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTournament(seed.id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Evento borrado");
      router.push("/dashboard/torneos");
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {isSeed && <input type="hidden" name="tournament_id" value={seed.id} />}
      <input type="hidden" name="mode" value={isCircuit || isSeed ? "caos" : mode} />
      <input type="hidden" name="outfit" value={outfit} />
      <input
        type="hidden"
        name="event_type"
        value={isCircuit || isSeed ? "circuit" : "class"}
      />
      <input type="hidden" name="ranked" value={ranked ? "on" : "off"} />
      {isCircuit && !specifyDate && (
        <input type="hidden" name="scheduled_for" value={todayKey ?? ""} />
      )}

      {!isSeed && (
        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
            Modalidad
          </span>
          <div className="grid grid-cols-2 gap-2">
            <ModeCard
              active={mode === "classic"}
              onClick={() => pickMode("classic")}
              title="Clásico"
              description="Bracket normal. Las reglas de siempre."
            />
            <ModeCard
              active={mode === "caos"}
              onClick={() => pickMode("caos")}
              title="CAOS"
              accent
              mark
              description="Cada pelea se rolea: terreno y cartas de duelo."
            />
          </div>

          {mode === "caos" && (
            <div className="mt-2 space-y-2 border border-accent/40 bg-accent/5 p-3">
              <div>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent">
                  Ruleset · define el mazo de cartas
                </p>
                <div className="mt-1.5 flex gap-2">
                  {Object.entries(OUTFITS).map(([key, meta]) => {
                    const active = outfit === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setOutfit(key)}
                        aria-pressed={active}
                        className={`btn btn-xs flex-1 ${
                          active ? "btn-accent" : "btn-outline"
                        }`}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-[0.65rem] font-semibold opacity-70">
                  {OUTFITS[outfit].tagline} — {deck.terrains.length} terrenos y{" "}
                  {deck.duels.length} duelos en el mazo.
                </p>
              </div>

              <ul className="space-y-1 border-t border-accent/20 pt-2 text-xs font-medium opacity-80">
                <li>
                  · Antes de cada pelea sale un <b>terreno</b> que aplica a los
                  dos y una <b>carta de duelo</b> partida: uno arranca con
                  ventaja, el otro con carga.
                </li>
                <li>
                  · Si el que carga la desventaja gana, cobra{" "}
                  <b>+20 / +40 / +60 XP</b> según lo dura que estaba la carta.
                </li>
                <li>
                  · Ganar por sumisión paga <b>+{CAOS_POINTS.finish} XP</b> extra,
                  venga del lado que venga. Así nadie se guinda de la ventaja a
                  estancar la pelea.
                </li>
              </ul>

              <Link
                href="/dashboard/torneos/manual"
                className="btn btn-outline btn-xs btn-block"
              >
                Ver el manual completo
              </Link>
            </div>
          )}
        </div>
      )}

      {!isSeed && mode === "caos" && (
        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
            Tipo de evento
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(EVENT_TYPES).map(([key, meta]) => {
              const active = eventType === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => pickEventType(key)}
                  aria-pressed={active}
                  className={`clip-cut border-2 p-3 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-base-300 bg-base-200 hover:border-base-content/30"
                  }`}
                >
                  <p
                    className={`text-sm font-black uppercase tracking-[0.15em] ${
                      active ? "text-primary" : "opacity-70"
                    }`}
                  >
                    {meta.label}
                  </p>
                  <p className="mt-1 text-[0.65rem] font-semibold leading-snug opacity-60">
                    {meta.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          <label className="mt-2 flex cursor-pointer items-start gap-2 border border-base-300 bg-base-200 p-3">
            <input
              type="checkbox"
              checked={ranked}
              onChange={(e) => setRanked(e.target.checked)}
              className="checkbox-primary checkbox checkbox-sm mt-0.5"
            />
            <span className="text-[0.65rem] font-semibold leading-snug">
              Cuenta para el <b>ranking CAOS</b>.{" "}
              <span className="opacity-60">
                Quítalo si es un bracket de prueba o un demo para explicar el
                modo: se pelea igual, pero no suma puntos.
              </span>
            </span>
          </label>
        </div>
      )}

      {isCircuit && (
        <div className="border border-accent/40 bg-accent/5 p-4">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-accent">
            Fecha del circuito
          </p>
          <p className="mt-1 text-[0.65rem] font-semibold opacity-70">
            Si no la tocas, queda hoy. Los peleadores se eligen el día del
            evento, no ahora.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setSpecifyDate(false)}
              aria-pressed={!specifyDate}
              className={`btn btn-xs flex-1 uppercase ${
                !specifyDate ? "btn-accent" : "btn-outline"
              }`}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setSpecifyDate(true)}
              aria-pressed={specifyDate}
              className={`btn btn-xs flex-1 uppercase ${
                specifyDate ? "btn-accent" : "btn-outline"
              }`}
            >
              Especificar fecha
            </button>
          </div>
          {specifyDate ? (
            <label className="mt-3 block">
              <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-widest opacity-70">
                Día del evento
              </span>
              <input
                name="scheduled_for"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
          ) : (
            <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-accent">
              {formatDayLabel(todayKey)}
            </p>
          )}
        </div>
      )}

      {!isSeed && (
        <label className="block w-full">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
            Nombre del {isCircuit ? "evento" : "tope"}
          </span>
          <input
            name="title"
            maxLength={80}
            placeholder={
              isCircuit
                ? "Circuito CAOS"
                : mode === "caos"
                  ? "Torneo CAOS"
                  : "Tope interno"
            }
            className="input input-bordered w-full"
          />
        </label>
      )}

      {isSeed && (
        <div className="flex flex-wrap items-center gap-2 border border-base-300 bg-base-200 p-3">
          <span className="tag-skew bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content">
            <span>Coach mode</span>
          </span>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-60">
            Marca quién pelea hoy y sortea
          </p>
          <button
            type="button"
            className="btn btn-outline btn-error btn-xs ml-auto uppercase"
            onClick={handleDeleteSeed}
            disabled={isPending}
          >
            Borrar
          </button>
        </div>
      )}

      {needsRoster && (
        <FighterRoster
          students={students}
          selected={selected}
          allSelected={allSelected}
          toggle={toggle}
          setSelected={setSelected}
          hasGuests={hasGuests}
          guests={guests}
          answerGuests={answerGuests}
          setGuestCount={setGuestCount}
          renameGuest={renameGuest}
          rerollGuest={rerollGuest}
          rerollAllGuests={rerollAllGuests}
          idleLabel={isSeed ? "Fuera" : "Faltó"}
        />
      )}

      <button
        className={`btn btn-block ${
          isCircuit || mode === "caos" || isSeed ? "btn-accent" : "btn-primary"
        }`}
        disabled={isPending || !canSubmit}
      >
        {isPending && <span className="loading loading-spinner loading-xs" />}
        {isCircuit
          ? "Crear evento"
          : `Sortear bracket (${totalFighters} peleador${
              totalFighters === 1 ? "" : "es"
            }${guestCount > 0 ? `, ${guestCount} inv.` : ""})`}
      </button>

      {needsRoster && totalFighters < 2 && (
        <p className="text-center text-xs font-semibold uppercase tracking-widest opacity-50">
          Se necesitan al menos 2 peleadores
        </p>
      )}
    </form>
  );
}

function formatDayLabel(iso) {
  if (!iso) return "Hoy";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function FighterRoster({
  students,
  selected,
  allSelected,
  toggle,
  setSelected,
  hasGuests,
  guests,
  answerGuests,
  setGuestCount,
  renameGuest,
  rerollGuest,
  rerollAllGuests,
  idleLabel = "Faltó",
}) {
  return (
    <>
      <div className="border border-base-300 bg-base-200">
        <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            En el tatami:{" "}
            <span className="text-primary">{selected.size}</span> / {students.length}
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-xs uppercase"
            onClick={() =>
              setSelected(
                allSelected ? new Set() : new Set(students.map((s) => s.id))
              )
            }
          >
            {allSelected ? "Quitar todos" : "Marcar todos"}
          </button>
        </div>

        {!students.length && (
          <p className="p-4 text-sm opacity-60">
            Aún no hay alumnos registrados en el gym.
          </p>
        )}

        <div className="max-h-80 divide-y divide-base-300 overflow-y-auto">
          {students.map((student) => {
            const isIn = selected.has(student.id);
            return (
              <label
                key={student.id}
                className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-opacity ${
                  isIn ? "" : "opacity-40"
                }`}
              >
                <input
                  type="checkbox"
                  name="student_ids"
                  value={student.id}
                  checked={isIn}
                  onChange={() => toggle(student.id)}
                  className="checkbox-primary checkbox checkbox-sm"
                />
                <span className="truncate text-sm font-semibold">
                  {student.full_name || "Alumno"}
                </span>
                {!isIn && (
                  <span className="ml-auto text-[0.6rem] font-bold uppercase tracking-widest opacity-60">
                    {idleLabel}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className="border border-base-300 bg-base-200">
        <div className="border-b border-base-300 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            ¿Hay invitados hoy?
          </p>
          <p className="mt-1 text-[0.65rem] font-semibold opacity-60">
            Gente sin cuenta en la app. Pelean el bracket completo, pero no
            cobran XP ni entran al ranking CAOS: no hay dónde acumularlo. El
            que quiera puntos, que se registre antes de sortear.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => answerGuests(false)}
              aria-pressed={hasGuests === false}
              className={`btn btn-xs flex-1 uppercase ${
                hasGuests === false ? "btn-primary" : "btn-outline"
              }`}
            >
              No, solo alumnos
            </button>
            <button
              type="button"
              onClick={() => answerGuests(true)}
              aria-pressed={hasGuests === true}
              className={`btn btn-xs flex-1 uppercase ${
                hasGuests === true ? "btn-primary" : "btn-outline"
              }`}
            >
              Sí, hay invitados
            </button>
          </div>
        </div>

        {hasGuests && (
          <div className="space-y-3 p-4">
            <label className="block">
              <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-widest opacity-70">
                ¿Cuántos son?
              </span>
              <input
                type="number"
                min={0}
                max={MAX_GUESTS}
                value={guests.length}
                onChange={(e) => setGuestCount(e.target.value)}
                className="input input-bordered input-sm w-24"
              />
            </label>

            {guests.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
                    Nombres de guerra
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs uppercase"
                    onClick={rerollAllGuests}
                  >
                    Regenerar 🎲
                  </button>
                </div>

                <div className="space-y-2">
                  {guests.map((guest, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 shrink-0 text-[0.65rem] font-black opacity-40">
                        {i + 1}
                      </span>
                      <input
                        name="guest_names"
                        value={guest}
                        maxLength={MAX_GUEST_NAME}
                        onChange={(e) => renameGuest(i, e.target.value)}
                        className="input input-bordered input-sm w-full"
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm shrink-0 px-2"
                        onClick={() => rerollGuest(i)}
                        title="Otro nombre"
                      >
                        🎲
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-[0.6rem] font-semibold opacity-50">
                  Se pueden editar si prefieres el nombre real.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function ModeCard({ active, onClick, title, description, accent, mark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`clip-cut relative overflow-hidden border-2 p-3 text-left transition-colors ${
        active
          ? accent
            ? "border-accent bg-accent/10"
            : "border-primary bg-primary/10"
          : "border-base-300 bg-base-200 hover:border-base-content/30"
      }`}
    >
      <p
        className={`display relative flex items-center gap-2 text-2xl ${
          active ? (accent ? "text-accent" : "text-primary") : "opacity-70"
        }`}
      >
        {mark && <CaosMark className="h-8 w-auto" />}
        {title}
      </p>
      <p className="relative mt-1 text-[0.65rem] font-semibold leading-snug opacity-60">
        {description}
      </p>
    </button>
  );
}
