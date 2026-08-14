// ============================================================================
// TORNEO CAOS — modalidad de torneo con modificadores aleatorios por pelea.
//
// Inspirado en ARAM: Chaos de Riot, pero traducido a reglas reales de
// jiu-jitsu (constraints-led training). Cada pelea del bracket se "rolea"
// una sola vez y saca DOS cosas:
//
//   1. TERRENO  → una regla de arena que aplica IGUAL a los dos peleadores
//                 (tiempo, área, qué vale punto, qué finaliza). Nunca toca
//                 la posición de arranque, así nunca choca con el duelo.
//
//   2. DUELO    → una carta doble: ALFA (ventaja) y OMEGA (desventaja).
//                 Las dos mitades son la misma situación vista de cada lado
//                 —si a uno le toca "arrancas montado", al otro le toca
//                 "arrancas debajo de la montada"— así el arranque siempre
//                 es coherente. Hay duelos NEUTROS (0/0) donde los dos
//                 arrancan igual y nadie tiene ventaja.
//
// Por qué es justo: la asimetría no se compensa cambiando la regla, se
// compensa con el premio. El OMEGA gana XP extra si se lleva la pelea
// (upset), y el ALFA solo saca XP extra si FINALIZA (nada de guindarse de
// la ventaja y estancar la pelea). Los dos tienen algo que buscar.
//
// GI vs NO-GI: cada carta trae un `outfit`. La mayoría son 'both' (funcionan
// igual con o sin kimono); las demás son propias de su ruleset —agarres de
// solapa y cinturón en gi, leglocks y controles de cuerpo en no-gi— y solo
// entran al mazo del torneo que las puede jugar.
//
// El peso (weight) es lo único que la base de datos necesita para repartir
// los puntos: se guarda junto al roll en tournament_match_rolls.
// Ver supabase/migrations/20260806120000_caos.sql.
// ============================================================================

export const TOURNAMENT_MODES = {
  classic: {
    label: "Clásico",
    tagline: "Bracket de eliminación simple. Las reglas de siempre.",
  },
  caos: {
    label: "CAOS",
    tagline: "Cada pelea se rolea: terreno aleatorio y cartas de duelo.",
  },
};

// Con o sin kimono. Define qué cartas entran al mazo del torneo.
export const OUTFITS = {
  nogi: {
    label: "No-Gi",
    short: "No-Gi",
    tagline: "Sin kimono. Controles de cuerpo, piernas y scrambles.",
  },
  gi: {
    label: "Gi",
    short: "Gi",
    tagline: "Con kimono. Solapa, manga y cinturón entran al juego.",
  },
};

export const DEFAULT_OUTFIT = "nogi";

// ----------------------------------------------------------------------------
// TIPO DE EVENTO
//
// El mismo bracket se juega en dos contextos distintos: el tope que sale
// dentro de la clase y el evento oficial que se arma para pelearlo y grabarlo.
// Los dos suman al ranking CAOS; lo que cambia es que se pueden mirar por
// separado. Ver supabase/migrations/20260811120000_caos_ranking.sql.
// ----------------------------------------------------------------------------
export const EVENT_TYPES = {
  class: {
    label: "Tope de clase",
    short: "Clase",
    tagline: "El tope de siempre, dentro del entrenamiento.",
  },
  circuit: {
    label: "Circuito",
    short: "Circuito",
    tagline: "Evento oficial. El que se arma para pelearlo y grabarlo.",
  },
};

export const DEFAULT_EVENT_TYPE = "class";

// ----------------------------------------------------------------------------
// PUNTOS DE CAOS (PC) — la moneda del ranking competitivo.
//
// Nada que ver con el XP: el XP mide compromiso con el gym y mueve el
// cinturón; los PC miden récord de peleas en modalidad CAOS. Un alumno puede
// ser cinturón azul con cero PC, y un peleador nuevo puede liderar el CAOS.
//
// No se guardan en ninguna tabla: la vista caos_leaderboard los calcula a
// partir de las peleas. Estos valores son solo para pintar la UI y DEBEN
// coincidir con la vista de la migración.
// ----------------------------------------------------------------------------
export const CAOS_RANK_POINTS = {
  fight: 20,
  win: 100,
  submission: 50,
  // Por nivel de la carta que se remontó: 25 / 50 / 75.
  upsetPerTier: 25,
  champion: 200,
  finalist: 100,
};

// XP extra que solo existe en la modalidad CAOS.
// Debe coincidir con los triggers de la migración.
export const CAOS_POINTS = {
  // Ganar desde la desventaja: 10 XP por cada punto de diferencia de peso.
  // Diferencia = 2 × tier ⇒ 20 / 40 / 60 XP.
  upsetPerWeight: 10,
  // Ganar por sumisión en el CAOS, sin importar de qué lado te tocó.
  finish: 20,
};

// Cuántas veces sale cada nivel de locura. La mayoría de las peleas salen
// suaves; el tier 3 es el momento de video.
const TIER_ODDS = [
  { tier: 0, chance: 0.25 }, // duelo neutro: los dos igual
  { tier: 1, chance: 0.35 },
  { tier: 2, chance: 0.25 },
  { tier: 3, chance: 0.15 },
];

export const TIER_LABELS = {
  0: "Neutro",
  1: "Leve",
  2: "Serio",
  3: "Brutal",
};

export const TIER_ODDS_LABELS = Object.fromEntries(
  TIER_ODDS.map(({ tier, chance }) => [tier, `${Math.round(chance * 100)}%`])
);

// ----------------------------------------------------------------------------
// TERRENOS — regla de arena, igual para los dos. Nunca define el arranque.
// ----------------------------------------------------------------------------
export const TERRAINS = [
  // ---- Sirven con o sin kimono --------------------------------------------
  {
    key: "muerte_subita",
    outfit: "both",
    name: "Muerte Súbita",
    rule: "No hay puntos. Solo la sumisión decide. Si nadie finaliza, gana quien haya tenido la última posición dominante.",
  },
  {
    key: "esquina_caliente",
    outfit: "both",
    name: "Esquina Caliente",
    rule: "El área se reduce a la mitad del tatami. Salirse = reinicio de pie y una ventaja para el rival.",
  },
  {
    key: "reloj_roto",
    outfit: "both",
    name: "Reloj Roto",
    rule: "Tres minutos, sin prórroga. Si terminan empatados, gana el que arrancó en la posición peor.",
  },
  {
    key: "tierra_de_piernas",
    outfit: "both",
    name: "Tierra de Piernas",
    rule: "Las sumisiones a las piernas valen doble. Las estrangulaciones no terminan la pelea, solo dan ventaja.",
  },
  {
    key: "suelo_de_lava",
    outfit: "both",
    name: "Suelo de Lava",
    rule: "Nadie puede quedarse de espaldas más de cinco segundos. Al sexto, ventaja para el rival.",
  },
  {
    key: "aire_viciado",
    outfit: "both",
    name: "Aire Viciado",
    rule: "Cada sesenta segundos suena el silbato: los dos se sueltan y reinician de pie desde cero.",
  },
  {
    key: "sin_retirada",
    outfit: "both",
    name: "Sin Retirada",
    rule: "Prohibido reiniciar de pie. Lo que empieza en el suelo se resuelve en el suelo.",
  },
  {
    key: "mundo_al_reves",
    outfit: "both",
    name: "Mundo al Revés",
    rule: "Barrer vale 4, montar vale 2, pasar la guardia vale 1. Todo lo demás igual.",
  },
  {
    key: "presion_total",
    outfit: "both",
    name: "Presión Total",
    rule: "Cada diez segundos seguidos en posición dominante suman un punto extra. Se acumula.",
  },
  {
    key: "sin_manos",
    outfit: "both",
    name: "Manos de Piedra",
    rule: "Prohibido entrelazar los dedos y prohibido el gable grip. Todo control es con antebrazo, palma abierta y presión.",
  },

  // ---- Solo GI -------------------------------------------------------------
  {
    key: "tatami_resbaloso",
    outfit: "gi",
    name: "Tatami Resbaloso",
    rule: "Prohibido agarrar solapa, manga y cinturón. Se pelea como si fuera no-gi, aunque estén de kimono.",
  },
  {
    key: "guerra_de_solapas",
    outfit: "gi",
    name: "Guerra de Solapas",
    rule: "Solo valen agarres de solapa y cinturón. Manga y pantalón prohibidos, para los dos.",
  },
  {
    key: "cuello_abierto",
    outfit: "gi",
    name: "Cuello Abierto",
    rule: "Las estrangulaciones con solapa valen doble. Todo lo demás puntúa normal.",
  },

  // ---- Solo NO-GI ----------------------------------------------------------
  {
    key: "piel_de_anguila",
    outfit: "nogi",
    name: "Piel de Anguila",
    rule: "Nadie puede mantener la misma posición de control más de quince segundos. Al dieciséis, reinicio neutro de pie.",
  },
  {
    key: "zona_de_talones",
    outfit: "nogi",
    name: "Zona de Talones",
    rule: "Se abren todos los leglocks. Se para al enganchar limpio: nadie rota, y el enganche cuenta como sumisión.",
  },
  {
    key: "cuerpo_a_cuerpo",
    outfit: "nogi",
    name: "Cuerpo a Cuerpo",
    rule: "Prohibido agarrar el short y la rashguard. Todo el control sale de cabeza, cadera y presión.",
  },
];

// ----------------------------------------------------------------------------
// DUELOS — carta doble. `alfa` tiene la ventaja (+tier), `omega` la carga
// (-tier). Los duelos de tier 0 son simétricos: los dos leen lo mismo.
// `start` describe cómo arrancan, para que el profesor solo tenga que leer.
// ----------------------------------------------------------------------------
export const DUELS = [
  // ---- Tier 0 · los dos arrancan igual, pura situación rara ----------------
  {
    key: "n_espalda_con_espalda",
    tier: 0,
    outfit: "both",
    name: "Espalda con Espalda",
    start: "Sentados en el centro, espalda contra espalda.",
    alfa: { name: "Espalda con Espalda", rule: "Al silbato, a pelear. El primero que tome la espalda del otro decide la pelea." },
    omega: { name: "Espalda con Espalda", rule: "Al silbato, a pelear. El primero que tome la espalda del otro decide la pelea." },
  },
  {
    key: "n_agarre_ciego",
    tier: 0,
    outfit: "both",
    name: "Agarre Ciego",
    start: "De rodillas, frente con frente, ya agarrados.",
    alfa: { name: "Agarre Ciego", rule: "Arrancan con el agarre puesto y no se puede soltar los primeros diez segundos." },
    omega: { name: "Agarre Ciego", rule: "Arrancan con el agarre puesto y no se puede soltar los primeros diez segundos." },
  },
  {
    key: "n_pie_de_guerra",
    tier: 0,
    outfit: "both",
    name: "Pie de Guerra",
    start: "Los dos de pie, a distancia de agarre.",
    alfa: { name: "Pie de Guerra", rule: "Prohibido sentarse a la guardia. Hay que derribar. Sentarse regala dos puntos." },
    omega: { name: "Pie de Guerra", rule: "Prohibido sentarse a la guardia. Hay que derribar. Sentarse regala dos puntos." },
  },
  {
    key: "n_doble_guardia",
    tier: 0,
    outfit: "both",
    name: "Doble Guardia",
    start: "Los dos sentados, manos agarradas.",
    alfa: { name: "Doble Guardia", rule: "Nadie puede pararse. El que llegue arriba primero se lleva la ventaja." },
    omega: { name: "Doble Guardia", rule: "Nadie puede pararse. El que llegue arriba primero se lleva la ventaja." },
  },
  {
    key: "n_cazadores",
    tier: 0,
    outfit: "both",
    name: "Cazadores",
    start: "Los dos de pie.",
    alfa: { name: "Cazadores", rule: "Solo las sumisiones a las piernas terminan la pelea. Lo de arriba no cuenta." },
    omega: { name: "Cazadores", rule: "Solo las sumisiones a las piernas terminan la pelea. Lo de arriba no cuenta." },
  },
  {
    key: "n_tortugas",
    tier: 0,
    outfit: "both",
    name: "Tortugas",
    start: "Los dos en tortuga, hombro con hombro.",
    alfa: { name: "Tortugas", rule: "Nadie puede voltearse de espaldas. Se sale hacia arriba o hacia la espalda del otro." },
    omega: { name: "Tortugas", rule: "Nadie puede voltearse de espaldas. Se sale hacia arriba o hacia la espalda del otro." },
  },
  {
    key: "n_solapa_amarrada",
    tier: 0,
    outfit: "gi",
    name: "Solapa Amarrada",
    start: "De pie, cada uno con la solapa del otro en la mano.",
    alfa: { name: "Solapa Amarrada", rule: "Nadie puede soltar la solapa que tiene agarrada. Si la sueltas, el rival gana una ventaja." },
    omega: { name: "Solapa Amarrada", rule: "Nadie puede soltar la solapa que tiene agarrada. Si la sueltas, el rival gana una ventaja." },
  },
  {
    key: "n_collar_tie",
    tier: 0,
    outfit: "nogi",
    name: "Mano en la Nuca",
    start: "De pie, los dos con collar tie puesto.",
    alfa: { name: "Mano en la Nuca", rule: "Arrancan con la mano en la nuca del otro. El primero que rompa el cuello del rival decide por dónde va la pelea." },
    omega: { name: "Mano en la Nuca", rule: "Arrancan con la mano en la nuca del otro. El primero que rompa el cuello del rival decide por dónde va la pelea." },
  },

  // ---- Tier 1 · ±1 ---------------------------------------------------------
  {
    key: "t1_primer_agarre",
    tier: 1,
    outfit: "both",
    name: "La Ventaja del Agarre",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Primer Agarre", rule: "Escoges y pones tu agarre antes de que suene el silbato." },
    omega: { name: "Manos Abajo", rule: "Arrancas con las manos al costado. No agarras hasta que suene." },
  },
  {
    key: "t1_media_guardia",
    tier: 1,
    outfit: "both",
    name: "Media Guardia",
    start: "En el suelo, media guardia armada.",
    alfa: { name: "Encima", rule: "Arrancas arriba en media guardia. Tu meta: pasar." },
    omega: { name: "Debajo", rule: "Arrancas abajo en media guardia. Tu meta: recomponer o barrer." },
  },
  {
    key: "t1_mano_muerta",
    tier: 1,
    outfit: "both",
    name: "Mano Muerta",
    start: "De pie, sin agarres.",
    alfa: { name: "Manos Libres", rule: "Peleas sin restricción de agarres." },
    omega: { name: "Mano Muerta", rule: "Solo un agarre a la vez. Si agarras con las dos, sueltas y el rival gana una ventaja." },
  },
  {
    key: "t1_boton_de_panico",
    tier: 1,
    outfit: "both",
    name: "Botón de Pánico",
    start: "De rodillas, frente con frente.",
    alfa: { name: "Botón de Pánico", rule: "Una vez en la pelea puedes pedir reinicio de pie, en el momento que quieras." },
    omega: { name: "Sin Salida", rule: "No puedes pedir reinicio. Sales de donde caigas." },
  },
  {
    key: "t1_guardia_cerrada",
    tier: 1,
    outfit: "both",
    name: "Guardia Cerrada",
    start: "En el suelo, guardia cerrada.",
    alfa: { name: "Dentro", rule: "Arrancas dentro de la guardia cerrada. Tu meta: abrir y pasar." },
    omega: { name: "Fuera", rule: "Arrancas con la guardia cerrada puesta. Tu meta: barrer o finalizar." },
  },
  {
    key: "t1_sin_solapa",
    tier: 1,
    outfit: "gi",
    name: "Kimono Cerrado",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Agarre Completo", rule: "Agarras lo que quieras: solapa, manga, pantalón, cinturón." },
    omega: { name: "Sin Solapa", rule: "No puedes agarrar solapa ni cinturón del rival. Solo manga y pantalón." },
  },
  {
    key: "t1_sin_cuello",
    tier: 1,
    outfit: "nogi",
    name: "Cuello Cerrado",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Cuello Libre", rule: "Atacas el cuello cuando quieras: guillotina, D'arce, lo que salga." },
    omega: { name: "Sin Cuello", rule: "Prohibido el front headlock y cualquier ataque al cuello desde el frente. Tienes que ir a la espalda o a las piernas." },
  },

  // ---- Tier 2 · ±2 ---------------------------------------------------------
  {
    key: "t2_guardia_partida",
    tier: 2,
    outfit: "both",
    name: "Guardia Partida",
    start: "En el suelo, cien kilos armado.",
    alfa: { name: "Cien Kilos", rule: "Arrancas en control lateral, con la guardia ya pasada." },
    omega: { name: "Aplastado", rule: "Arrancas debajo del control lateral. Tu meta: recomponer la guardia o salir." },
  },
  {
    key: "t2_rodilla_en_barriga",
    tier: 2,
    outfit: "both",
    name: "Rodilla en la Barriga",
    start: "En el suelo, rodilla en la barriga puesta.",
    alfa: { name: "Rodilla Puesta", rule: "Arrancas con la rodilla en la barriga y dos puntos ya en el marcador." },
    omega: { name: "Bajo la Rodilla", rule: "Arrancas plano, con la rodilla del rival encima y dos puntos abajo." },
  },
  {
    key: "t2_cazador_de_piernas",
    tier: 2,
    outfit: "both",
    name: "Cazador de Piernas",
    start: "Los dos sentados, a distancia.",
    alfa: { name: "Todo Vale", rule: "Ganas por lo que sea: puntos, sumisión, lo que salga." },
    omega: { name: "Cazador de Piernas", rule: "Solo ganas por sumisión a las piernas. Nada más te cuenta." },
  },
  {
    key: "t2_segunda_vida",
    tier: 2,
    outfit: "both",
    name: "Segunda Vida",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Segunda Vida", rule: "La primera sumisión que te metan no cuenta: se reinicia neutro y sigue la pelea." },
    omega: { name: "Una Sola Vida", rule: "La primera que te metan, se acabó. Sin red." },
  },
  {
    key: "t2_reloj_en_contra",
    tier: 2,
    outfit: "both",
    name: "Reloj en Contra",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "El Tiempo Juega", rule: "Si pasan dos minutos sin resultado, la pelea es tuya." },
    omega: { name: "Reloj en Contra", rule: "Tienes dos minutos para ganar. Si suenan, pierdes." },
  },
  {
    key: "t2_lapel_libre",
    tier: 2,
    outfit: "gi",
    name: "Tela de Araña",
    start: "En el suelo, guardia abierta.",
    alfa: { name: "Lapel Libre", rule: "Puedes desenrollar tu propia solapa y usarla para atrapar, enredar y estrangular." },
    omega: { name: "Tela Prohibida", rule: "No puedes agarrar tela: ni la del rival ni la tuya. Todo a cuerpo." },
  },
  {
    key: "t2_pierna_enredada",
    tier: 2,
    outfit: "nogi",
    name: "Nudo de Piernas",
    start: "En el suelo, ashi garami armado.",
    alfa: { name: "Ashi Garami", rule: "Arrancas con la pierna del rival enredada y el control puesto. Tu meta: la sumisión." },
    omega: { name: "Pierna Comprometida", rule: "Arrancas con tu pierna atrapada. Tu meta: sacarla y llegar arriba." },
  },

  // ---- Tier 3 · ±3 ---------------------------------------------------------
  {
    key: "t3_depredador",
    tier: 3,
    outfit: "both",
    name: "Depredador",
    start: "En el suelo, espalda tomada con cinturón de seguridad y dos ganchos.",
    alfa: { name: "Depredador", rule: "Arrancas con la espalda del rival tomada, ganchos puestos." },
    omega: { name: "Presa", rule: "Arrancas con la espalda entregada. Tu meta: sacar los ganchos y salir." },
  },
  {
    key: "t3_rey_de_la_montada",
    tier: 3,
    outfit: "both",
    name: "Rey de la Montada",
    start: "En el suelo, montada armada.",
    alfa: { name: "Rey de la Montada", rule: "Arrancas montado, con cuatro puntos ya en el marcador." },
    omega: { name: "Bajo la Montada", rule: "Arrancas debajo de la montada, cuatro puntos abajo. Tu meta: escapar." },
  },
  {
    key: "t3_todo_o_nada",
    tier: 3,
    outfit: "both",
    name: "Todo o Nada",
    start: "Los dos sentados, a distancia.",
    alfa: { name: "Marcador Limpio", rule: "Ganas por puntos, por sumisión o por decisión. Lo normal." },
    omega: { name: "Todo o Nada", rule: "Los puntos no te cuentan. O finalizas, o pierdes." },
  },
  {
    key: "t3_brazo_atado_gi",
    tier: 3,
    outfit: "gi",
    name: "Brazo Atado",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Dos Brazos", rule: "Peleas completo, sin restricción." },
    omega: { name: "Brazo Atado", rule: "Peleas con un solo brazo: el otro va metido en tu propio cinturón y ahí se queda toda la pelea." },
  },
  {
    key: "t3_brazo_atado_nogi",
    tier: 3,
    outfit: "nogi",
    name: "Brazo Muerto",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Dos Brazos", rule: "Peleas completo, sin restricción." },
    omega: { name: "Brazo Muerto", rule: "Peleas con un solo brazo: el otro va agarrado a tu propio short y no se suelta." },
  },
  {
    key: "t3_solo_la_espalda",
    tier: 3,
    outfit: "nogi",
    name: "Solo la Espalda",
    start: "Los dos de pie.",
    alfa: { name: "Camino Libre", rule: "Ganas por donde quieras: puntos, cualquier sumisión, decisión." },
    omega: { name: "Solo la Espalda", rule: "Únicamente ganas tomando la espalda y finalizando desde ahí. Nada más te cuenta." },
  },
];

// Índices por clave, para leer un roll guardado sin recorrer los mazos.
// Se indexa TODO el mazo (gi y no-gi) para que un roll viejo siga leyéndose
// aunque el torneo haya sido de otro ruleset.
const TERRAIN_BY_KEY = Object.fromEntries(TERRAINS.map((t) => [t.key, t]));
const DUEL_BY_KEY = Object.fromEntries(DUELS.map((d) => [d.key, d]));

/**
 * Una carta entra al mazo si sirve para los dos rulesets o si es justo la
 * del ruleset que se está jugando.
 */
function fitsOutfit(card, outfit) {
  return card.outfit === "both" || card.outfit === outfit;
}

/**
 * El mazo completo de un ruleset, agrupado como lo pide el manual.
 */
export function deckFor(outfit) {
  const terrains = TERRAINS.filter((t) => fitsOutfit(t, outfit));
  const duels = DUELS.filter((d) => fitsOutfit(d, outfit));

  return {
    terrains,
    duels,
    // Duelos por nivel, de neutro a brutal.
    duelsByTier: [0, 1, 2, 3].map((tier) => ({
      tier,
      duels: duels.filter((d) => d.tier === tier),
    })),
  };
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// ----------------------------------------------------------------------------
// ESCAPARATE — el mazo puesto a la venta.
//
// Explicar CAOS con adjetivos no vende: lo que engancha es enseñar UNA carta
// de verdad y el tamaño del mazo. Esto arma esa muestra para las piezas de
// convocatoria (el flyer, el correo y la página del evento), siempre con las
// cartas que de verdad se pueden jugar en ese ruleset.
//
// La muestra se escoge con la semilla del evento, no al azar: el flyer se
// genera muchas veces (preview, descarga, correo, redes) y en todas tiene que
// salir la misma carta. Dos eventos distintos enseñan cartas distintas.
//
// No se usa el mazo entero: hay nombres que en un póster suenan a chiste
// (Mano Muerta, Botón de Pánico). Aquí solo entran las que se leen como
// pelea. El dueño invita a gente que ya eligió — no hay que suavizar.
// ----------------------------------------------------------------------------

/** Hash estable de un texto a entero positivo. */
function seedFrom(value) {
  let hash = 0;
  for (const char of String(value ?? "caos")) {
    hash = (hash * 31 + char.codePointAt(0)) | 0;
  }
  return Math.abs(hash);
}

const SHOWCASE_DUEL_KEYS = new Set([
  "n_pie_de_guerra",
  "n_cazadores",
  "n_espalda_con_espalda",
  "t2_cazador_de_piernas",
  "t2_pierna_enredada",
  "t2_reloj_en_contra",
  "t2_guardia_partida",
  "t3_depredador",
  "t3_rey_de_la_montada",
  "t3_todo_o_nada",
  "t3_solo_la_espalda",
  "t2_lapel_libre",
  "n_solapa_amarrada",
  "t3_brazo_atado_gi",
]);

export function caosShowcase(seed, outfit = DEFAULT_OUTFIT) {
  const deck = deckFor(OUTFITS[outfit] ? outfit : DEFAULT_OUTFIT);
  const n = seedFrom(seed);
  const poster = deck.duels.filter((duel) => SHOWCASE_DUEL_KEYS.has(duel.key));
  const duels = poster.length ? poster : deck.duels;

  return {
    terrain: deck.terrains[n % deck.terrains.length],
    duel: duels[Math.floor(n / 7) % duels.length],
    terrainCount: deck.terrains.length,
    duelCount: deck.duels.length,
    combos: deck.terrains.length * deck.duels.length,
    tiers: [0, 1, 2, 3].map((tier) => ({
      tier,
      label: TIER_LABELS[tier],
      odds: TIER_ODDS_LABELS[tier],
    })),
  };
}

/**
 * Escoge el nivel de locura del duelo según TIER_ODDS.
 */
function rollTier() {
  const roll = Math.random();
  let acc = 0;
  for (const { tier, chance } of TIER_ODDS) {
    acc += chance;
    if (roll < acc) return tier;
  }
  return 0;
}

/**
 * Rolea una pelea completa con el mazo del ruleset que se esté jugando. El
 * lado ALFA se sortea entre los dos peleadores, así que estar de primero en
 * el bracket no te da nada.
 *
 * Devuelve exactamente las columnas de datos de tournament_match_rolls.
 */
export function rollMatch(outfit = DEFAULT_OUTFIT) {
  const deck = deckFor(OUTFITS[outfit] ? outfit : DEFAULT_OUTFIT);

  const terrain = pick(deck.terrains);
  const tier = rollTier();
  const candidates = deck.duels.filter((d) => d.tier === tier);
  // Cada tier siempre tiene cartas 'both', así que candidates nunca va
  // vacío; el fallback es solo por si alguien poda el mazo a mano.
  const duel = pick(candidates.length ? candidates : deck.duels);
  const alfaIsStudent1 = Math.random() < 0.5;

  return {
    tier: duel.tier,
    terrain_key: terrain.key,
    duel_key: duel.key,
    // Peso: +tier para el que tiene la ventaja, -tier para el que carga.
    // En los duelos neutros los dos van en 0 y no hay upset que pagar.
    student1_weight: alfaIsStudent1 ? duel.tier : -duel.tier,
    student2_weight: alfaIsStudent1 ? -duel.tier : duel.tier,
  };
}

/**
 * Reconstruye un roll guardado en cartas listas para pintar. Devuelve null
 * si la pelea no se ha roleado o si el mazo cambió y la clave ya no existe.
 */
export function readRoll(roll) {
  if (!roll) return null;

  const terrain = TERRAIN_BY_KEY[roll.terrain_key];
  const duel = DUEL_BY_KEY[roll.duel_key];
  if (!terrain || !duel) return null;

  const w1 = roll.student1_weight ?? 0;
  const w2 = roll.student2_weight ?? 0;

  return {
    tier: roll.tier ?? duel.tier,
    terrain,
    duel,
    start: duel.start,
    // Cada lado con su mitad de la carta doble.
    sides: {
      student1: { card: w1 >= w2 ? duel.alfa : duel.omega, weight: w1 },
      student2: { card: w2 > w1 ? duel.alfa : duel.omega, weight: w2 },
    },
    // Diferencia de peso: 0 en duelos neutros, 2×tier en los asimétricos.
    spread: Math.abs(w1 - w2),
    bounty: Math.abs(w1 - w2) * CAOS_POINTS.upsetPerWeight,
  };
}

/**
 * Tono visual de una carta según su peso: ventaja, carga o neutro.
 */
export function cardTone(weight) {
  if (weight > 0) return "alfa";
  if (weight < 0) return "omega";
  return "neutro";
}

export const CARD_TONE_LABELS = {
  alfa: "Ventaja",
  omega: "Carga",
  neutro: "Igualdad",
};

// ----------------------------------------------------------------------------
// RANKING CAOS
// ----------------------------------------------------------------------------

export const CAOS_RANKING_MIGRATION =
  "supabase/migrations/20260811120000_caos_ranking.sql";

/**
 * La base todavía no tiene las vistas ni las columnas del ranking CAOS.
 * Mismo criterio que isMissingAcademies en libs/academies.js.
 */
export function isMissingCaosRanking(error) {
  return ["42703", "42P01", "PGRST200", "PGRST204", "PGRST205"].includes(
    error?.code
  );
}

// Los tres tableros del ranking CAOS. La clave es la que viaja en la URL
// (?tipo=circuito) y el sufijo es el juego de columnas de caos_leaderboard
// que hay que leer: la vista trae cada número tres veces.
export const CAOS_BOARDS = {
  todo: {
    suffix: "",
    label: "Todo",
    tagline: "Cada pelea CAOS, venga de donde venga.",
  },
  circuito: {
    suffix: "_circuit",
    label: "Circuito",
    tagline: "Solo los eventos oficiales.",
  },
  clase: {
    suffix: "_class",
    label: "Clase",
    tagline: "Solo los topes que salen en el entrenamiento.",
  },
};

export const DEFAULT_CAOS_BOARD = "todo";

/**
 * Lee una fila de caos_leaderboard con el juego de columnas del tablero
 * pedido. Las derrotas no vienen de la base: son peleas menos victorias.
 */
export function readCaosRow(row, board = DEFAULT_CAOS_BOARD) {
  const suffix = CAOS_BOARDS[board]?.suffix ?? "";
  const stat = (key) => row[`${key}${suffix}`] ?? 0;

  const fights = stat("fights");
  const wins = stat("wins");

  return {
    pc: stat("pc"),
    fights,
    wins,
    losses: fights - wins,
    submissions: stat("submissions"),
    upsets: stat("upsets"),
    titles: stat("titles"),
  };
}

/**
 * El ranking listo para pintar: solo quien tiene actividad en ese tablero,
 * ordenado por PC. Los empates son comunes (20 / 120 / 140), así que el
 * desempate se define completo para que el orden no baile entre renders.
 */
export function rankCaosBoard(rows, board = DEFAULT_CAOS_BOARD) {
  return (rows ?? [])
    .map((row) => ({ ...row, ...readCaosRow(row, board) }))
    // Toda pelea paga al menos 20 PC: cero significa no haber peleado aquí.
    .filter((row) => row.pc > 0)
    .sort(
      (a, b) =>
        b.pc - a.pc ||
        b.wins - a.wins ||
        a.fights - b.fights ||
        (a.full_name || "").localeCompare(b.full_name || "", "es")
    );
}
