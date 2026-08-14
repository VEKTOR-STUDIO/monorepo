import { CAOS_OATH } from "@/libs/caos";
import {
  CAOS_SCRIPT,
  CAOS_SCRIPT_LINES,
  CAOS_SCRIPT_ROLL,
} from "@/libs/caos-script";

const NAV = [
  { href: "#hoja", label: "Hoja" },
  { href: "#papel", label: "Papel" },
  { href: "#roleo", label: "Roleo" },
  { href: "#reloj", label: "Reloj" },
  { href: "#notas", label: "Notas" },
];

// Guion de rodaje del Torneo CAOS, para leerlo del teléfono en el gym.
// Las líneas del host van en display; las acotaciones, chiquitas. El papel
// se pinta desde CAOS_OATH para que la noche diga lo mismo que el producto.
export default function CaosScript() {
  return (
    <div className="space-y-10">
      <nav className="sticky top-0 z-30 -mx-4 border-b border-base-300 bg-base-100/95 px-4 py-2 backdrop-blur md:-mx-0 md:px-0">
        <ul className="flex gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block whitespace-nowrap px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 hover:text-primary hover:opacity-100"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <RolesAndRoster />
      <HostSheet />
      <ThePaper />
      <RollTemplate />
      <Clock />
      <Beats />
      <Overrides />
      <Dont />
    </div>
  );
}

function RolesAndRoster() {
  return (
    <section className="space-y-4">
      <div className="grid gap-2 md:grid-cols-3">
        {CAOS_SCRIPT.roles.map((role) => (
          <div
            key={role.name}
            className="clip-cut border-2 border-base-300 bg-base-200 p-4"
          >
            <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
              {role.name}
            </p>
            <p className="mt-2 text-sm font-medium opacity-80">{role.does}</p>
          </div>
        ))}
      </div>

      <div className="clip-cut border-2 border-base-300 bg-base-200 p-4">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60">
          {CAOS_SCRIPT.roster.title}
        </p>
        <p className="mt-1 text-sm font-medium opacity-70">
          {CAOS_SCRIPT.roster.note}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {CAOS_SCRIPT.roster.slots.map((slot) => (
            <div
              key={slot.id}
              className="border border-base-300 bg-base-100 px-3 py-4"
            >
              <p className="display text-3xl text-primary">{slot.label}</p>
              <p className="mt-2 border-b border-base-300 pb-1 text-sm opacity-40">
                nombre
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold">
          {CAOS_SCRIPT.roster.bracket}
        </p>
      </div>
    </section>
  );
}

function HostSheet() {
  return (
    <section id="hoja" className="scroll-mt-16 space-y-4">
      <SectionTitle index="01" title="Hoja del host" />
      <p className="text-sm font-medium opacity-70">
        Solo lo que se dice, en orden. Las acotaciones no se leen. Después de
        cada dado, saltá a Roleo y leé las cartas.
      </p>

      <ol className="space-y-4">
        {CAOS_SCRIPT_LINES.map((beat, i) => (
          <li
            key={beat.id}
            id={beat.id}
            className="scroll-mt-16 clip-cut border-2 border-base-300 bg-base-200"
          >
            <div className="flex items-baseline justify-between gap-3 border-b border-base-300 px-4 py-3">
              <div className="flex items-baseline gap-3">
                <span className="display text-stroke text-2xl leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display text-2xl">
                  {beat.act}
                  <span className="text-primary">.</span>
                </h3>
              </div>
            </div>
            <div className="space-y-4 p-4">
              <p className="text-xs font-medium italic opacity-60">{beat.cue}</p>

              {beat.fromOath && (
                <a
                  href="#papel"
                  className="block border border-dashed border-primary bg-primary/10 px-4 py-3 text-center text-[0.65rem] font-black uppercase tracking-[0.25em] text-primary"
                >
                  Leé el papel entero ↓
                </a>
              )}

              {beat.say?.length > 0 && (
                <div>
                  {beat.fromOath && (
                    <p className="mb-2 text-[0.55rem] font-black uppercase tracking-[0.25em] opacity-50">
                      Todavía con los cuatro dentro
                    </p>
                  )}
                  <HostLines lines={beat.say} />
                </div>
              )}

              {beat.afterRoll && <RollCue />}

              {beat.beforeWhistle?.length > 0 && (
                <HostLines lines={beat.beforeWhistle} />
              )}

              {beat.close?.length > 0 && (
                <div className="border-t border-base-300 pt-4">
                  <p className="mb-2 text-[0.55rem] font-black uppercase tracking-[0.25em] opacity-50">
                    Después del silbato
                  </p>
                  <HostLines lines={beat.close} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ThePaper() {
  return (
    <section id="papel" className="scroll-mt-16 space-y-4">
      <SectionTitle index="02" title="El papel" />
      <p className="text-sm font-medium opacity-70">
        Los cuatro dentro. Cámara a las caras. Cada punto es un corte. No se
        vuelve a leer.
      </p>

      <div className="clip-cut border-2 border-primary bg-base-200 px-4 py-6 md:px-6">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
          {CAOS_OATH.label} · {CAOS_OATH.cue}
        </p>

        <div className="mt-6 space-y-1">
          {CAOS_OATH.lead.map((line) => (
            <p key={line} className="text-base font-medium md:text-lg">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-8 space-y-2">
          {CAOS_OATH.nos.map((line) => (
            <p key={line} className="display text-3xl leading-none md:text-4xl">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-8 space-y-1">
          {CAOS_OATH.pay.map((line) => (
            <p key={line} className="text-base font-semibold md:text-lg">
              {line}
            </p>
          ))}
        </div>

        <p className="mt-6 text-base font-medium opacity-80 md:text-lg">
          {CAOS_OATH.ref}
        </p>

        <div className="mt-8">
          <p className="display text-2xl md:text-3xl">{CAOS_OATH.clean}</p>
          <p className="mt-2 text-base font-semibold opacity-80">
            {CAOS_OATH.winner}
          </p>
          <p className="display mt-3 text-2xl text-primary md:text-3xl">
            {CAOS_OATH.mercy}
          </p>
        </div>

        <div className="mt-10 border-t-2 border-base-300 pt-6">
          <p className="mb-3 text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-50">
            Todavía con los cuatro dentro
          </p>
          <HostLines lines={CAOS_SCRIPT.afterOath} />
        </div>
      </div>
    </section>
  );
}

function RollTemplate() {
  const roll = CAOS_SCRIPT_ROLL;

  return (
    <section id="roleo" className="scroll-mt-16 space-y-4">
      <SectionTitle index="03" title="Después del dado" />
      <p className="text-sm font-medium opacity-70">{roll.cue}</p>

      <div className="grid gap-3 md:grid-cols-2">
        <RollCard label="Terreno" lines={roll.terrain} />
        <RollCard label="Duelo" lines={roll.duel} />
        <RollCard label="Si hay ventaja y carga" lines={roll.sides} />
        <RollCard label="Si salió neutro" lines={roll.neutro} />
      </div>

      <div className="clip-cut border-2 border-primary bg-primary/10 p-4">
        <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
          El reloj, siempre
        </p>
        <div className="mt-3">
          <HostLines lines={roll.clock} />
        </div>
      </div>
    </section>
  );
}

function Clock() {
  return (
    <section id="reloj" className="scroll-mt-16 space-y-4">
      <SectionTitle index="04" title="Reloj de la noche" />
      <p className="text-sm font-medium opacity-70">
        Si una pelea se acaba antes, no rellenés con charla. Cortá.
      </p>
      <ol className="divide-y divide-base-300 border border-base-300">
        {CAOS_SCRIPT.clock.map((row) => (
          <li key={row.time} className="flex gap-4 bg-base-200 px-4 py-3">
            <span className="display w-16 shrink-0 text-xl text-primary">
              {row.time}
            </span>
            <span className="text-sm font-medium opacity-85">{row.what}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Beats() {
  return (
    <section className="space-y-4">
      <SectionTitle index="05" title="Ocho beats" />
      <p className="text-sm font-medium opacity-70">
        Cada pelea. Después del papel, no se inventa un noveno.
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {CAOS_SCRIPT.beats.map((beat) => (
          <div
            key={beat.n}
            className="clip-cut relative border-2 border-base-300 bg-base-200 p-4"
          >
            <span
              aria-hidden="true"
              className="display text-stroke pointer-events-none absolute -bottom-1 right-1 select-none text-5xl leading-none"
            >
              {beat.n}
            </span>
            <p className="display relative text-xl text-primary">{beat.title}</p>
            <p className="relative mt-1 text-sm font-medium opacity-75">
              {beat.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Overrides() {
  return (
    <section className="space-y-4">
      <SectionTitle index="06" title="Si las cartas dicen lo contrario" />
      <p className="text-sm font-medium opacity-70">
        Estas te cambian el reloj o el silbato. El resto se lee y se pelea.
      </p>
      <div className="space-y-2">
        {CAOS_SCRIPT.overrides.map((row) => (
          <div
            key={row.card}
            className="clip-cut border-2 border-base-300 bg-base-200 p-4"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="display text-2xl">
                {row.card}
                <span className="text-primary">.</span>
              </p>
              <span className="text-[0.55rem] font-black uppercase tracking-[0.2em] opacity-50">
                {row.kind}
              </span>
            </div>
            <p className="display mt-2 text-xl">{row.say}</p>
            <p className="mt-1 text-sm font-medium opacity-70">{row.does}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Dont() {
  return (
    <section id="notas" className="scroll-mt-16 space-y-4">
      <SectionTitle index="07" title="Lo que no hagas" />
      <ul className="space-y-2">
        {CAOS_SCRIPT.dont.map((line) => (
          <li
            key={line}
            className="border-l-2 border-accent bg-base-200 px-4 py-3 text-sm font-semibold"
          >
            {line}
          </li>
        ))}
      </ul>
      <p className="display text-2xl text-primary">{CAOS_SCRIPT.duration}</p>
    </section>
  );
}

function HostLines({ lines }) {
  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <p key={`${i}-${line}`} className="display text-2xl leading-tight md:text-3xl">
          {line}
        </p>
      ))}
    </div>
  );
}

function RollCue() {
  return (
    <a
      href="#roleo"
      className="block border border-dashed border-base-300 bg-base-100 px-4 py-3 text-center text-[0.65rem] font-black uppercase tracking-[0.25em] text-primary"
    >
      Roleo · leé las cartas
    </a>
  );
}

function RollCard({ label, lines }) {
  return (
    <div className="clip-cut border-2 border-base-300 bg-base-200 p-4">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60">
        {label}
      </p>
      <div className="mt-3">
        <HostLines lines={lines} />
      </div>
    </div>
  );
}

function SectionTitle({ index, title }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="display text-stroke select-none text-3xl leading-none">
        {index}
      </span>
      <h2 className="display text-3xl">
        {title}
        <span className="text-primary">.</span>
      </h2>
    </div>
  );
}
