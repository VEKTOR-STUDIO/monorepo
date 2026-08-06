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

// ----------------------------------------------------------------------------
// TERRENOS — regla de arena, igual para los dos. Nunca define el arranque.
// ----------------------------------------------------------------------------
export const TERRAINS = [
  {
    key: "muerte_subita",
    name: "Muerte Súbita",
    rule: "No hay puntos. Solo la sumisión decide. Si nadie finaliza, gana quien haya tenido la última posición dominante.",
  },
  {
    key: "esquina_caliente",
    name: "Esquina Caliente",
    rule: "El área se reduce a la mitad del tatami. Salirse = reinicio de pie y una ventaja para el rival.",
  },
  {
    key: "reloj_roto",
    name: "Reloj Roto",
    rule: "Tres minutos, sin prórroga. Si terminan empatados, gana el que arrancó en la posición peor.",
  },
  {
    key: "tierra_de_piernas",
    name: "Tierra de Piernas",
    rule: "Las sumisiones a las piernas valen doble. Las estrangulaciones no terminan la pelea, solo dan ventaja.",
  },
  {
    key: "tatami_resbaloso",
    name: "Tatami Resbaloso",
    rule: "Prohibido agarrar solapa, manga y cinturón. Todo a cuerpo, como si fuera no-gi.",
  },
  {
    key: "suelo_de_lava",
    name: "Suelo de Lava",
    rule: "Nadie puede quedarse de espaldas más de cinco segundos. Al sexto, ventaja para el rival.",
  },
  {
    key: "aire_viciado",
    name: "Aire Viciado",
    rule: "Cada sesenta segundos suena el silbato: los dos se sueltan y reinician de pie desde cero.",
  },
  {
    key: "sin_retirada",
    name: "Sin Retirada",
    rule: "Prohibido reiniciar de pie. Lo que empieza en el suelo se resuelve en el suelo.",
  },
  {
    key: "mundo_al_reves",
    name: "Mundo al Revés",
    rule: "Barrer vale 4, montar vale 2, pasar la guardia vale 1. Todo lo demás igual.",
  },
  {
    key: "presion_total",
    name: "Presión Total",
    rule: "Cada diez segundos seguidos en posición dominante suman un punto extra. Se acumula.",
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
    name: "Espalda con Espalda",
    start: "Sentados en el centro, espalda contra espalda.",
    alfa: { name: "Espalda con Espalda", rule: "Al silbato, a pelear. El primero que tome la espalda del otro decide la pelea." },
    omega: { name: "Espalda con Espalda", rule: "Al silbato, a pelear. El primero que tome la espalda del otro decide la pelea." },
  },
  {
    key: "n_agarre_ciego",
    tier: 0,
    name: "Agarre Ciego",
    start: "De rodillas, frente con frente, ya agarrados.",
    alfa: { name: "Agarre Ciego", rule: "Arrancan con el agarre puesto y no se puede soltar los primeros diez segundos." },
    omega: { name: "Agarre Ciego", rule: "Arrancan con el agarre puesto y no se puede soltar los primeros diez segundos." },
  },
  {
    key: "n_pie_de_guerra",
    tier: 0,
    name: "Pie de Guerra",
    start: "Los dos de pie, a distancia de agarre.",
    alfa: { name: "Pie de Guerra", rule: "Prohibido sentarse a la guardia. Hay que derribar. Sentarse regala dos puntos." },
    omega: { name: "Pie de Guerra", rule: "Prohibido sentarse a la guardia. Hay que derribar. Sentarse regala dos puntos." },
  },
  {
    key: "n_doble_guardia",
    tier: 0,
    name: "Doble Guardia",
    start: "Los dos sentados, manos agarradas.",
    alfa: { name: "Doble Guardia", rule: "Nadie puede pararse. El que llegue arriba primero se lleva la ventaja." },
    omega: { name: "Doble Guardia", rule: "Nadie puede pararse. El que llegue arriba primero se lleva la ventaja." },
  },
  {
    key: "n_cazadores",
    tier: 0,
    name: "Cazadores",
    start: "Los dos de pie.",
    alfa: { name: "Cazadores", rule: "Solo las sumisiones a las piernas terminan la pelea. Lo de arriba no cuenta." },
    omega: { name: "Cazadores", rule: "Solo las sumisiones a las piernas terminan la pelea. Lo de arriba no cuenta." },
  },
  {
    key: "n_tortugas",
    tier: 0,
    name: "Tortugas",
    start: "Los dos en tortuga, hombro con hombro.",
    alfa: { name: "Tortugas", rule: "Nadie puede voltearse de espaldas. Se sale hacia arriba o hacia la espalda del otro." },
    omega: { name: "Tortugas", rule: "Nadie puede voltearse de espaldas. Se sale hacia arriba o hacia la espalda del otro." },
  },

  // ---- Tier 1 · ±1 ---------------------------------------------------------
  {
    key: "t1_primer_agarre",
    tier: 1,
    name: "La Ventaja del Agarre",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Primer Agarre", rule: "Escoges y pones tu agarre antes de que suene el silbato." },
    omega: { name: "Manos Abajo", rule: "Arrancas con las manos al costado. No agarras hasta que suene." },
  },
  {
    key: "t1_media_guardia",
    tier: 1,
    name: "Media Guardia",
    start: "En el suelo, media guardia armada.",
    alfa: { name: "Encima", rule: "Arrancas arriba en media guardia. Tu meta: pasar." },
    omega: { name: "Debajo", rule: "Arrancas abajo en media guardia. Tu meta: recomponer o barrer." },
  },
  {
    key: "t1_mano_muerta",
    tier: 1,
    name: "Mano Muerta",
    start: "De pie, sin agarres.",
    alfa: { name: "Manos Libres", rule: "Peleas sin restricción de agarres." },
    omega: { name: "Mano Muerta", rule: "Solo un agarre a la vez. Si agarras con las dos, sueltas y el rival gana una ventaja." },
  },
  {
    key: "t1_boton_de_panico",
    tier: 1,
    name: "Botón de Pánico",
    start: "De rodillas, frente con frente.",
    alfa: { name: "Botón de Pánico", rule: "Una vez en la pelea puedes pedir reinicio de pie, en el momento que quieras." },
    omega: { name: "Sin Salida", rule: "No puedes pedir reinicio. Sales de donde caigas." },
  },
  {
    key: "t1_guardia_cerrada",
    tier: 1,
    name: "Guardia Cerrada",
    start: "En el suelo, guardia cerrada.",
    alfa: { name: "Dentro", rule: "Arrancas dentro de la guardia cerrada. Tu meta: abrir y pasar." },
    omega: { name: "Fuera", rule: "Arrancas con la guardia cerrada puesta. Tu meta: barrer o finalizar." },
  },

  // ---- Tier 2 · ±2 ---------------------------------------------------------
  {
    key: "t2_guardia_partida",
    tier: 2,
    name: "Guardia Partida",
    start: "En el suelo, cien kilos armado.",
    alfa: { name: "Cien Kilos", rule: "Arrancas en control lateral, con la guardia ya pasada." },
    omega: { name: "Aplastado", rule: "Arrancas debajo del control lateral. Tu meta: recomponer la guardia o salir." },
  },
  {
    key: "t2_rodilla_en_barriga",
    tier: 2,
    name: "Rodilla en la Barriga",
    start: "En el suelo, rodilla en la barriga puesta.",
    alfa: { name: "Rodilla Puesta", rule: "Arrancas con la rodilla en la barriga y dos puntos ya en el marcador." },
    omega: { name: "Bajo la Rodilla", rule: "Arrancas plano, con la rodilla del rival encima y dos puntos abajo." },
  },
  {
    key: "t2_cazador_de_piernas",
    tier: 2,
    name: "Cazador de Piernas",
    start: "Los dos sentados, a distancia.",
    alfa: { name: "Todo Vale", rule: "Ganas por lo que sea: puntos, sumisión, lo que salga." },
    omega: { name: "Cazador de Piernas", rule: "Solo ganas por sumisión a las piernas. Nada más te cuenta." },
  },
  {
    key: "t2_segunda_vida",
    tier: 2,
    name: "Segunda Vida",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Segunda Vida", rule: "La primera sumisión que te metan no cuenta: se reinicia neutro y sigue la pelea." },
    omega: { name: "Una Sola Vida", rule: "La primera que te metan, se acabó. Sin red." },
  },
  {
    key: "t2_reloj_en_contra",
    tier: 2,
    name: "Reloj en Contra",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "El Tiempo Juega", rule: "Si pasan dos minutos sin resultado, la pelea es tuya." },
    omega: { name: "Reloj en Contra", rule: "Tienes dos minutos para ganar. Si suenan, pierdes." },
  },

  // ---- Tier 3 · ±3 ---------------------------------------------------------
  {
    key: "t3_depredador",
    tier: 3,
    name: "Depredador",
    start: "En el suelo, espalda tomada con cinturón de seguridad y dos ganchos.",
    alfa: { name: "Depredador", rule: "Arrancas con la espalda del rival tomada, ganchos puestos." },
    omega: { name: "Presa", rule: "Arrancas con la espalda entregada. Tu meta: sacar los ganchos y salir." },
  },
  {
    key: "t3_rey_de_la_montada",
    tier: 3,
    name: "Rey de la Montada",
    start: "En el suelo, montada armada.",
    alfa: { name: "Rey de la Montada", rule: "Arrancas montado, con cuatro puntos ya en el marcador." },
    omega: { name: "Bajo la Montada", rule: "Arrancas debajo de la montada, cuatro puntos abajo. Tu meta: escapar." },
  },
  {
    key: "t3_brazo_atado",
    tier: 3,
    name: "Brazo Atado",
    start: "De pie, a distancia de agarre.",
    alfa: { name: "Dos Brazos", rule: "Peleas completo, sin restricción." },
    omega: { name: "Brazo Atado", rule: "Peleas con un solo brazo: el otro va metido en el cinturón y ahí se queda." },
  },
  {
    key: "t3_todo_o_nada",
    tier: 3,
    name: "Todo o Nada",
    start: "Los dos sentados, a distancia.",
    alfa: { name: "Marcador Limpio", rule: "Ganas por puntos, por sumisión o por decisión. Lo normal." },
    omega: { name: "Todo o Nada", rule: "Los puntos no te cuentan. O finalizas, o pierdes." },
  },
];

// Índices por clave, para leer un roll guardado sin recorrer los mazos.
const TERRAIN_BY_KEY = Object.fromEntries(TERRAINS.map((t) => [t.key, t]));
const DUEL_BY_KEY = Object.fromEntries(DUELS.map((d) => [d.key, d]));

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
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
 * Rolea una pelea completa. El lado ALFA se sortea entre los dos peleadores,
 * así que estar de primero en el bracket no te da nada.
 *
 * Devuelve exactamente las columnas de datos de tournament_match_rolls.
 */
export function rollMatch() {
  const terrain = pick(TERRAINS);
  const tier = rollTier();
  const duel = pick(DUELS.filter((d) => d.tier === tier));
  const alfaIsStudent1 = Math.random() < 0.5;

  return {
    tier,
    terrain_key: terrain.key,
    duel_key: duel.key,
    // Peso: +tier para el que tiene la ventaja, -tier para el que carga.
    // En los duelos neutros los dos van en 0 y no hay upset que pagar.
    student1_weight: alfaIsStudent1 ? tier : -tier,
    student2_weight: alfaIsStudent1 ? -tier : tier,
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
