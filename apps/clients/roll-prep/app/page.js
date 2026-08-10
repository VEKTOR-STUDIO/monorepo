import Link from "next/link";
import ButtonSignin from "@/components/ButtonSignin";
import BeltBadge from "@/components/rollprep/BeltBadge";
import config from "@/config";
import { createPublicClient } from "@/libs/supabase/public";
import { BELTS, POINT_VALUES, formatXp } from "@/libs/gamification";
import {
  CAOS_POINTS,
  DUELS,
  OUTFITS,
  TERRAINS,
  TIER_LABELS,
  TIER_ODDS_LABELS,
  deckFor,
} from "@/libs/caos";

// La landing se arma con los datos REALES del juego (los cinturones de
// libs/gamification.js y el mazo de libs/caos.js). Si mañana cambia una carta
// o un umbral de XP, la página cambia sola: nunca promete algo que la app no
// hace. El concepto completo vive en CONCEPTO.md.

const marqueeItems = [
  "Estudia la clase",
  "+50 XP",
  "Vota el próximo tema",
  "Sube de cinturón",
  "Rolea el CAOS",
  "Oss",
];

// El ciclo semanal: lo que hace el alumno entre entreno y entreno.
const loop = [
  {
    number: "01",
    kicker: "Martes → Jueves",
    title: "Estudia la clase",
    description:
      "El profesor asigna el video. Llegas al tatami sabiendo qué se va a trabajar, no descubriéndolo.",
    xp: POINT_VALUES.assignment_completed,
  },
  {
    number: "02",
    kicker: "Jueves → Martes",
    title: "Vota el próximo tema",
    description:
      "Tres opciones sobre la mesa. El currículo no lo decide una sola persona: lo decide la clase.",
    xp: POINT_VALUES.poll_voted,
  },
  {
    number: "03",
    kicker: "Todo el tiempo",
    title: "Discute la técnica",
    description:
      "Dudas, variantes y lo que le salió a cada quien, en el hilo de cada clase. Queda escrito.",
    xp: POINT_VALUES.comment_posted,
  },
  {
    number: "04",
    kicker: "Día de tope",
    title: "Pelea el bracket",
    description:
      "Topes internos con bracket real. Participar suma, llegar a la final suma más, ganarlo lo paga todo.",
    xp: POINT_VALUES.tournament_champion,
  },
];

// Lo que rodea al loop, sin ser el loop.
const extras = [
  {
    title: "Videoteca",
    description: "El archivo técnico completo, clase por clase. Nada se pierde.",
  },
  {
    title: "Calendario",
    description: "Las clases del mes, día por día, con link al detalle.",
  },
  {
    title: "Ranking por academia",
    description: "El top del gym por XP, filtrable por academia del circuito.",
  },
  {
    title: "Brackets con invitados",
    description:
      "El que vino a probar entra al tope con nombre de guerra. Sin cuenta, sin fricción.",
  },
  {
    title: "Panel del profesor",
    description:
      "Quién estudió y quién votó, en vivo. Métricas mientras la clase pasa.",
  },
  {
    title: "Historial de XP",
    description:
      "Cada punto con su fecha y su motivo. Tu expediente, no un número suelto.",
  },
];

// Una pelea de ejemplo del mazo, para enseñar la anatomía de un roleo.
const sampleTerrain = TERRAINS.find((t) => t.key === "muerte_subita");
const sampleDuel = DUELS.find((d) => d.key === "t3_rey_de_la_montada");
const sampleBounty = sampleDuel.tier * 2 * CAOS_POINTS.upsetPerWeight;

const nogiDeck = deckFor("nogi");
const giDeck = deckFor("gi");

// La landing se cachea y revalida cada 10 minutos: el XP del gym no cambia
// tanto como para consultar la base en cada visita.
export const revalidate = 600;

/**
 * XP acumulado por todos los alumnos (vista public.gym_stats, ver la
 * migración 20260810120000_gym_stats.sql). Devuelve null si falta la
 * migración o la base no responde: entonces la landing enseña un guion en
 * vez de un número inventado.
 */
async function getGymPoints() {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("gym_stats")
    .select("total_points")
    .maybeSingle();

  return data?.total_points ?? null;
}

export default async function Page() {
  const totalPoints = await getGymPoints();

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100 text-base-content">
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="display text-2xl">
          Roll<span className="text-primary">Prep</span>
        </span>
        <ButtonSignin text="Entrar" extraStyle="btn-primary btn-sm md:btn-md" />
      </header>

      <main className="relative z-10">
        {/* ------------------------------ HERO --------------------------- */}
        <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 md:pt-20">
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute -top-6 right-0 select-none text-[10rem] leading-none md:text-[18rem]"
          >
            BJJ
          </span>

          <div className="rise rise-1 flex flex-wrap items-center gap-2">
            <span className="tag-skew bg-primary px-3 py-1 text-xs text-primary-content">
              <span>Jiu-Jitsu Brasileño</span>
            </span>
            <span className="tag-skew bg-base-300 px-3 py-1 text-xs">
              <span>Gi &amp; No-Gi</span>
            </span>
          </div>

          <h1 className="display rise rise-2 mt-6 max-w-4xl text-4xl md:text-6xl lg:text-8xl">
            El jiu-jitsu ya era un videojuego.{" "}
            <span className="text-primary">Nadie lo había programado.</span>
          </h1>

          <p className="rise rise-3 mt-8 max-w-2xl text-lg font-medium leading-relaxed opacity-70">
            Cinturones, grados, torneos, academias, sumisiones: el jiu-jitsu
            lleva un siglo con sistema de progresión, tabla de puntos y
            condiciones de victoria. {config.appName} es la capa digital que lo
            lee como lo que es — un LMS de artes marciales construido como
            juego, no un curso con medallitas pegadas encima.
          </p>

          <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-4">
            <Link href="/signin" className="btn btn-primary btn-lg px-10">
              Empezar a entrenar
            </Link>
            <Link href="#caos" className="btn btn-outline btn-lg">
              Ver el modo CAOS
            </Link>
          </div>

          {/* Barra de credenciales: lo que ya existe, en números. */}
          <div className="rise rise-5 mt-14 grid max-w-3xl grid-cols-1 gap-px border border-base-300 bg-base-300 sm:grid-cols-3">
            <Stat
              value={totalPoints === null ? "—" : formatXp(totalPoints)}
              label="XP sudado por el equipo"
            />
            <Stat value="2" label="Modos de juego" />
            <Stat value={TERRAINS.length + DUELS.length} label="Cartas del CAOS" />
          </div>
        </section>

        {/* --------------------------- MARQUEE --------------------------- */}
        <div className="overflow-hidden border-y border-base-300 bg-primary py-3 text-primary-content">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {marqueeItems.concat(marqueeItems).map((item, i) => (
                  <span
                    key={i}
                    className="display mx-6 whitespace-nowrap text-xl tracking-wide"
                  >
                    {item} <span className="mx-2 opacity-40">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------- LOOP ---------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeading
            kicker="El core loop"
            title="El XP se gana afuera de la app"
            lead="No se premia el tiempo de pantalla. Se premia haber estudiado, haber opinado y haber ido a pelear. La app es el marcador — el juego pasa en el tatami."
          />

          <div className="mt-12 grid gap-px overflow-hidden border border-base-300 bg-base-300 md:grid-cols-2 lg:grid-cols-4">
            {loop.map((step) => (
              <div
                key={step.number}
                className="group relative bg-base-100 p-8 transition-colors duration-300 hover:bg-base-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="display text-stroke text-6xl transition-colors group-hover:text-primary group-hover:[-webkit-text-stroke:0px]">
                    {step.number}
                  </span>
                  <span className="tag-skew bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content">
                    <span>+{step.xp} XP</span>
                  </span>
                </div>
                <p className="mt-6 text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
                  {step.kicker}
                </p>
                <h3 className="display mt-2 text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed opacity-70">
                  {step.description}
                </p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------- PROGRESIÓN ------------------------- */}
        <section className="border-y border-base-300 bg-base-200">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              kicker="Progresión"
              title="Los rangos son los cinturones. Los de verdad."
              lead="Nada de Bronce, Plata y Oro. Cinco cinturones recorridos grado por grado, en el orden real del arte, con la escala calibrada para que signifiquen algo."
            />

            {/* El camino completo, con su XP de entrada. */}
            <div className="mt-12 grid gap-px overflow-hidden border border-base-300 bg-base-300 sm:grid-cols-3 lg:grid-cols-5">
              {BELTS.map((belt) => (
                <div key={belt.key} className="bg-base-200 p-5">
                  <span
                    className="tag-skew px-3 py-1 text-xs"
                    style={{ backgroundColor: belt.color, color: belt.ink }}
                  >
                    <span>{belt.short}</span>
                  </span>
                  <p className="display mt-4 text-3xl">
                    {formatXp(belt.degrees[0])}
                    <span className="ml-1 text-xs opacity-50">XP</span>
                  </p>
                  <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                    {belt.degrees.length - 1} grados hasta{" "}
                    {formatXp(belt.degrees[belt.degrees.length - 1])}
                  </p>
                  <div className="xp-bar mt-4">
                    <div
                      className="xp-bar-fill"
                      style={{ backgroundColor: belt.color, width: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="clip-cut relative overflow-hidden border-2 border-base-300 bg-base-100 p-6">
                <div
                  className="halftone absolute inset-0 opacity-50"
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
                    A dos clases por semana
                  </p>
                  <p className="mt-3 text-sm font-medium leading-relaxed opacity-80">
                    Con voto y comentario son unos{" "}
                    <b className="text-primary">600 XP al mes</b>. El camino
                    completo sale más o menos así:
                  </p>
                  <ul className="mt-4 space-y-1.5 text-sm font-semibold">
                    <Pace rank="Primer grado" time="~1 mes" />
                    <Pace rank="Azul" time="~7 meses" />
                    <Pace rank="Violeta" time="~1,5 años" />
                    <Pace rank="Marrón" time="~3,5 años" />
                    <Pace rank="Negra" time="~7 años" highlight />
                  </ul>
                </div>
              </div>

              <div className="clip-cut border-2 border-base-300 bg-base-100 p-6">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
                  Cómo se ve en tu HUD
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <BeltBadge totalPoints={0} size="md" showName />
                  <BeltBadge totalPoints={5600} size="md" showName />
                  <BeltBadge totalPoints={20400} size="md" showName />
                  <BeltBadge totalPoints={52000} size="md" showName />
                </div>
                <p className="mt-5 text-sm font-medium leading-relaxed opacity-70">
                  Cada punto lo otorga la base de datos, nunca el navegador, y
                  queda registrado con su fecha y su motivo. Un rango que se
                  sube en una semana no significa nada; aquí el ranking respira.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------ MODOS DE JUEGO ----------------------- */}
        <section id="caos" className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeading
            kicker="Modos de juego"
            title="Un mismo tatami. Varias formas de jugarlo."
            lead="La idea es la de Riot: mismo juego, mapas y restricciones distintas. Aquí el bracket, los participantes y el XP base son idénticos entre modos — lo que cambia es la capa de reglas encima."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {/* Clásico */}
            <div className="clip-cut border-2 border-base-300 bg-base-200 p-8">
              <span className="tag-skew bg-secondary px-3 py-1 text-xs text-secondary-content">
                <span>Modo Clásico</span>
              </span>
              <h3 className="display mt-6 text-4xl">Las reglas de siempre</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed opacity-70">
                Bracket de eliminación simple, seeds estándar, byes repartidos
                solos y resultados con método: sumisión, puntos, decisión, DQ o
                no presentado. Jiu-jitsu normal. Es la línea base.
              </p>
            </div>

            {/* CAOS */}
            <div className="caos-card caos-card-alfa relative overflow-hidden p-8">
              <div
                className="caos-tier-bar absolute inset-x-0 top-0 text-primary"
                aria-hidden="true"
              />
              <span
                aria-hidden="true"
                className="display text-stroke pointer-events-none absolute -bottom-10 -right-2 select-none text-[9rem] leading-none"
              >
                CAOS
              </span>
              <span className="tag-skew blink-soft relative bg-accent px-3 py-1 text-xs text-accent-content">
                <span>Modo CAOS</span>
              </span>
              <h3 className="display relative mt-6 text-4xl">
                Cada pelea se <span className="text-primary">rolea</span>
              </h3>
              <p className="relative mt-3 text-sm font-medium leading-relaxed opacity-80">
                El profesor tira el dado antes de cada pelea. Una sola vez: lo
                que salga, se pelea. Sale un <b>terreno</b> que aplica a los dos
                y una <b>carta de duelo</b> que parte la pelea en ventaja y
                carga.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-2 text-[0.6rem] font-black uppercase tracking-widest">
                <span className="border border-primary/40 px-2 py-1 text-primary">
                  {OUTFITS.nogi.short} · {nogiDeck.terrains.length} terrenos ·{" "}
                  {nogiDeck.duels.length} duelos
                </span>
                <span className="border border-primary/40 px-2 py-1 text-primary">
                  {OUTFITS.gi.short} · {giDeck.terrains.length} terrenos ·{" "}
                  {giDeck.duels.length} duelos
                </span>
              </div>
            </div>
          </div>

          {/* ------------------- ANATOMÍA DE UN ROLEO ------------------- */}
          <div className="mt-16">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
              Anatomía de un roleo
            </p>
            <h3 className="display mt-2 text-3xl md:text-4xl">
              Así se ve una pelea del CAOS
            </h3>

            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag-skew bg-base-300 px-3 py-1 text-xs">
                  <span>
                    Nivel {sampleDuel.tier} · {TIER_LABELS[sampleDuel.tier]}
                  </span>
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                  {sampleDuel.start}
                </span>
              </div>

              {/* TERRENO — igual para los dos */}
              <div className="caos-card caos-card-neutro">
                <div className="caos-tier-bar text-secondary" aria-hidden="true" />
                <div className="stripes p-5">
                  <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60">
                    Terreno · aplica a los dos
                  </p>
                  <p className="caos-title mt-1 text-3xl md:text-4xl">
                    {sampleTerrain.name}
                  </p>
                  <p className="mt-2 text-sm font-medium opacity-80">
                    {sampleTerrain.rule}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-base-300" />
                <p className="display text-2xl">
                  {sampleDuel.name}
                  <span className="text-primary">.</span>
                </p>
                <div className="h-px flex-1 bg-base-300" />
              </div>

              {/* DUELO — la carta doble */}
              <div className="grid gap-3 sm:grid-cols-2">
                <DuelCard
                  tone="alfa"
                  role="Ventaja +3"
                  card={sampleDuel.alfa}
                />
                <DuelCard
                  tone="omega"
                  role="Carga −3"
                  card={sampleDuel.omega}
                />
              </div>

              {/* La regla de oro */}
              <div className="clip-cut border-2 border-base-300 bg-base-200 p-6">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
                  La regla de oro
                </p>
                <p className="display mt-2 text-2xl md:text-3xl">
                  La desventaja no se compensa cambiando la regla.{" "}
                  <span className="text-primary">Se compensa con el premio.</span>
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="border-l-2 border-accent pl-4">
                    <p className="display text-3xl text-accent">
                      +{sampleBounty} XP
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-70">
                      Para el que carga, si se lleva la pelea. Diez XP por cada
                      punto de diferencia: 20 / 40 / 60 según el nivel.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <p className="display text-3xl text-primary">
                      +{CAOS_POINTS.finish} XP
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-70">
                      Para quien finalice. El que arranca con ventaja solo cobra
                      si termina la pelea — nada de guindarse a estancarla.
                    </p>
                  </div>
                </div>
              </div>

              {/* Probabilidades */}
              <div className="grid gap-px overflow-hidden border border-base-300 bg-base-300 sm:grid-cols-4">
                {[0, 1, 2, 3].map((tier) => (
                  <div key={tier} className="bg-base-100 p-5">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] opacity-50">
                      Nivel {tier}
                    </p>
                    <p
                      className={`display mt-1 text-2xl ${
                        tier === 3 ? "text-accent" : ""
                      }`}
                    >
                      {TIER_LABELS[tier]}
                    </p>
                    <p className="display mt-2 text-4xl text-primary">
                      {TIER_ODDS_LABELS[tier]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm font-medium leading-relaxed opacity-60">
              Debajo de la locura hay pedagogía: esto es entrenamiento por
              restricciones. Nadie practica escapar de la montada desde cuatro
              puntos abajo y con público mirando, hasta que la carta lo obliga.
              Y el roleo no es un texto que aparece — es una ceremonia a pantalla
              completa, hecha para proyectarse y para grabarse.
            </p>
          </div>
        </section>

        {/* ------------------------ MODO HISTORIA ------------------------ */}
        <section className="relative overflow-hidden border-y border-base-300 bg-base-200">
          <div
            className="halftone absolute inset-0 opacity-40"
            aria-hidden="true"
          />
          <span
            aria-hidden="true"
            className="display text-stroke pointer-events-none absolute -left-8 bottom-0 select-none text-[9rem] leading-none md:text-[16rem]"
          >
            ???
          </span>

          <div className="relative mx-auto max-w-6xl px-5 py-20">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag-skew blink-soft bg-accent px-3 py-1 text-xs text-accent-content">
                <span>Próximamente</span>
              </span>
              <span className="tag-skew bg-base-300 px-3 py-1 text-xs">
                <span>Tercer modo de juego</span>
              </span>
            </div>

            <h2 className="display mt-6 max-w-3xl text-5xl md:text-7xl">
              Modo <span className="text-primary">Historia</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed opacity-70">
              Los topes son el multijugador. Falta la campaña: un camino de un
              solo jugador que recorre el arte posición por posición, con
              capítulos que se desbloquean al completar el anterior, objetivos
              que se cumplen en el tatami y un jefe al final de cada uno — un
              tope donde toca demostrar lo que se estudió.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <StorySlot
                number="01"
                title="La Guardia"
                status="En desarrollo"
                unlocked
              />
              <StorySlot number="02" title="El Pase" />
              <StorySlot number="03" title="La Espalda" />
            </div>

            <p className="mt-8 max-w-2xl text-sm font-medium leading-relaxed opacity-50">
              El sistema de modos ya está probado: el bracket, los participantes
              y el XP base son idénticos entre modos, así que sumar uno nuevo no
              es reescribir el torneo. La campaña es el siguiente en la fila.
            </p>
          </div>
        </section>

        {/* ---------------------------- EXTRAS --------------------------- */}
        <section className="border-t border-base-300 bg-base-200">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              kicker="Y todo lo demás"
              title="La parte aburrida, también resuelta"
            />

            <div className="mt-12 grid gap-px overflow-hidden border border-base-300 bg-base-300 md:grid-cols-2 lg:grid-cols-3">
              {extras.map((item) => (
                <div
                  key={item.title}
                  className="group relative bg-base-200 p-7 transition-colors duration-300 hover:bg-base-100"
                >
                  <h3 className="display text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed opacity-70">
                    {item.description}
                  </p>
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------- CTA ----------------------------- */}
        <section className="mx-auto max-w-6xl px-5 py-24">
          <div className="relative overflow-hidden border border-base-300 bg-base-200 p-10 md:p-16">
            <span
              aria-hidden="true"
              className="display text-stroke pointer-events-none absolute -bottom-8 -right-2 select-none text-[8rem] leading-none md:text-[12rem]"
            >
              OSS
            </span>
            <h2 className="display max-w-2xl text-4xl md:text-6xl">
              Entrena con la mente. <span className="text-primary">Gana</span> en
              el tatami.
            </h2>
            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed opacity-70">
              Hecho para una clase de martes y jueves que se toma en serio lo que
              estudia. Si eso suena a tu gym, entra.
            </p>
            <Link href="/signin" className="btn btn-primary btn-lg mt-8 px-10">
              Unirme al equipo
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-base-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-6 text-xs font-semibold uppercase tracking-widest opacity-60">
          <span>
            {config.appName} — {new Date().getFullYear()}
          </span>
          <span>Martes &amp; Jueves · {config.timezone}</span>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------- Piezas de la página -------------------------- */

function SectionHeading({ kicker, title, lead }) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-primary">
        {kicker}
      </p>
      <h2 className="display mt-2 text-4xl md:text-5xl">
        {title}
        <span className="text-primary">.</span>
      </h2>
      {lead && (
        <p className="mt-4 text-base font-medium leading-relaxed opacity-70">
          {lead}
        </p>
      )}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-base-100 p-5">
      <p className="display text-4xl text-primary">{value}</p>
      <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
        {label}
      </p>
    </div>
  );
}

function Pace({ rank, time, highlight }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-base-300 pb-1.5">
      <span className={highlight ? "text-primary" : "opacity-80"}>{rank}</span>
      <span
        className={`text-xs uppercase tracking-widest ${
          highlight ? "text-primary" : "opacity-50"
        }`}
      >
        {time}
      </span>
    </li>
  );
}

/**
 * Slot de capítulo del Modo Historia: como una casilla de personaje sin
 * desbloquear en la pantalla de selección. El primero se asoma; los demás
 * siguen cerrados.
 */
function StorySlot({ number, title, status = "Bloqueado", unlocked = false }) {
  return (
    <div
      className={`clip-cut stripes relative overflow-hidden border-2 p-6 ${
        unlocked
          ? "border-primary/50 bg-base-100"
          : "border-base-300 bg-base-100/40"
      }`}
    >
      <span
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute -bottom-5 right-2 select-none text-8xl leading-none"
      >
        {number}
      </span>

      <p
        className={`text-[0.6rem] font-black uppercase tracking-[0.25em] ${
          unlocked ? "text-primary" : "opacity-40"
        }`}
      >
        Capítulo {number}
      </p>
      <p className={`display mt-2 text-3xl ${unlocked ? "" : "text-stroke"}`}>
        {title}
      </p>
      <p className="relative mt-4 text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
        {status}
      </p>
    </div>
  );
}

function DuelCard({ tone, role, card }) {
  const isAlfa = tone === "alfa";

  return (
    <div className={`caos-card caos-card-${tone}`}>
      <div
        className={`caos-tier-bar ${isAlfa ? "text-primary" : "text-accent"}`}
        aria-hidden="true"
      />
      <div className="p-5">
        <p
          className={`text-[0.6rem] font-black uppercase tracking-[0.25em] ${
            isAlfa ? "text-primary" : "text-accent"
          }`}
        >
          {role}
        </p>
        <p
          className={`caos-title mt-1 text-2xl md:text-3xl ${
            isAlfa ? "text-primary" : "text-accent"
          }`}
        >
          {card.name}
        </p>
        <p className="mt-2 text-sm font-medium opacity-80">{card.rule}</p>
      </div>
    </div>
  );
}
