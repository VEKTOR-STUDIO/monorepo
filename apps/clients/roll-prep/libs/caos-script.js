// ============================================================================
// GUIÓN DEL TORNEO CAOS — 4 almas.
//
// Lo que el profesor lee y dirige en un evento de cuatro peleadores, en el
// tono de Battle at the Berrics: el papel una sola vez, el roleo como el
// "call the trick", el host que no narra el round.
//
// El papel en sí NO vive aquí. Se lee de `CAOS_OATH` en libs/caos.js para
// que el video, el manual y la noche digan las mismas frases. Aquí está el
// resto: el reloj, las acotaciones, las líneas de cada ronda y lo que no
// hay que hacer.
//
// Solo se pinta en /dashboard/admin/guion. El layout de admin es el guard.
// ============================================================================

export const CAOS_SCRIPT = {
  kicker: "Solo el profesor",
  title: "Guion",
  display: "CAOS",
  tagline: "Cuatro peleas. El papel se lee una sola vez.",
  duration: "Seis minutos. A menos que las cartas digan lo contrario.",

  // Lo que se dice DESPUÉS del papel, todavía con los cuatro dentro.
  // El papel termina en la mercy line; esto cierra el acto.
  afterOath: [
    "Cuatro peleas.",
    "Semifinal. Loser bracket. Final.",
    "Seis minutos.",
    "A menos que las cartas digan lo contrario.",
  ],

  roster: {
    title: "El cuadro",
    note: "Se sortea antes del papel. Se rolea después. Nadie escoge rival.",
    slots: [
      { id: "A", label: "A" },
      { id: "B", label: "B" },
      { id: "C", label: "C" },
      { id: "D", label: "D" },
    ],
    bracket: "A vs B · C vs D. Los que ganan, final. Los que pierden, no se van.",
  },

  clock: [
    { time: "18:40", what: "Calentamiento. Sorteo del cuadro. Los cuatro ya saben contra quién van. Nadie rolea todavía." },
    { time: "19:00", what: "Los cuatro al octágono. El papel." },
    { time: "19:06", what: "Roleo + Semifinal 1 · A vs B." },
    { time: "19:16", what: "Agua. Los de la semi 2 entran." },
    { time: "19:20", what: "Roleo + Semifinal 2 · C vs D." },
    { time: "19:30", what: "Los finalistas se sientan. Los que perdieron se quedan." },
    { time: "19:34", what: "Roleo + Loser bracket · L1 vs L2." },
    { time: "19:44", what: "Agua larga. Los dos de la final." },
    { time: "19:50", what: "Roleo + Final · W1 vs W2." },
    { time: "20:00", what: "Campeón. Cierre. Oss." },
  ],

  roles: [
    { name: "Host", does: "Leés el papel, anunciás las rondas, leés las cartas. Steve Berra, no Bruce Buffer." },
    { name: "Árbitro", does: "Silbato, posiciones, los grises. No habla a cámara." },
    { name: "Cámara", does: "Wide del octágono para las peleas. Caras para el papel y el roleo." },
  ],

  // Los ocho beats de CADA pelea. Después del papel, no se inventa un noveno.
  beats: [
    { n: "1", title: "La ronda", text: "Una línea. Nombres. Nada más." },
    { n: "2", title: "El roleo", text: "Pantalla a cámara. El dado. Nadie habla encima. Cuando cae: un segundo de silencio." },
    { n: "3", title: "El terreno", text: "Nombre. Regla. Una vez." },
    { n: "4", title: "El duelo", text: "Nombre del duelo. Cómo arrancan. Cada mitad, con el nombre del peleador. No digas alfa ni omega: ventaja y carga. Si salió neutro: los dos igual, no hay bono." },
    { n: "5", title: "El reloj", text: "Seis minutos. A menos que las cartas digan lo contrario." },
    { n: "6", title: "El silbato", text: "El host se calla. El árbitro pone las posiciones. Silba." },
    { n: "7", title: "El corte", text: "Tap o tiempo. Mano arriba. Cámara sostiene tres segundos." },
    { n: "8", title: "El veredicto", text: "Una línea. El ganador pasa." },
  ],

  // Cartas que te cambian el reloj. El resto se lee y se pelea.
  overrides: [
    {
      card: "Reloj Roto",
      kind: "Terreno",
      say: "Tres minutos. Sin prórroga.",
      does: "3:00. Si empatan, gana el que arrancó peor.",
    },
    {
      card: "Reloj en Contra",
      kind: "Duelo",
      say: "El que carga tiene dos minutos. Si suenan, pierde.",
      does: "El árbitro marca 2:00 sobre esa pelea.",
    },
    {
      card: "Aire Viciado",
      kind: "Terreno",
      say: "Cada sesenta segundos, silbato. Se sueltan. De pie.",
      does: "El árbitro tiene que tener el reloj en la mano.",
    },
    {
      card: "Muerte Súbita",
      kind: "Terreno",
      say: "No hay puntos. Solo la sumisión. Si nadie finaliza, última posición dominante.",
      does: "El árbitro tiene que estar viendo la última posición.",
    },
  ],

  dont: [
    "No leas el papel otra vez antes de la final.",
    "No presentes a cada peleador con récord, cinturón ni apodo.",
    "No pongas música encima de las cartas.",
    "No hagas que se choquen los guantes a cámara en cada salida.",
    "No interviews entre peleas. Agua, y el siguiente roleo.",
    "No narres el round. El trick se ve.",
    "No digas tercer puesto como si fuera menos. Decí loser bracket primero; tercero, cuando ya ganó.",
  ],
};

// Las líneas que salen de la boca del host, en orden, para leerlas del
// teléfono. `say` es lo que se dice. `cue` es la acotación, no se lee.
export const CAOS_SCRIPT_LINES = [
  {
    id: "apertura",
    act: "Antes",
    cue: "Fuera de cámara, con ellos alrededor. Sin teatro.",
    say: [
      "El cuadro está. A contra B. C contra D.",
      "Los que ganen, final. Los que pierdan, no se van.",
    ],
  },
  {
    id: "papel",
    act: "El papel",
    cue: "Los cuatro dentro, en línea. Tres segundos de silencio. Después, el papel entero. No se vuelve a leer.",
    fromOath: true,
    say: CAOS_SCRIPT.afterOath,
  },
  {
    id: "semi-1",
    act: "Semifinal 1",
    cue: "A y B entran. No se tocan todavía.",
    say: [
      "Semifinal uno.",
      "A contra B.",
    ],
    afterRoll: true,
    close: ["Gana ______.", "Pasa a la final."],
  },
  {
    id: "semi-2",
    act: "Semifinal 2",
    cue: "A y B descansan a la vista. C y D entran.",
    say: [
      "Semifinal dos.",
      "C contra D.",
    ],
    afterRoll: true,
    close: ["Gana ______.", "Pasa a la final."],
  },
  {
    id: "loser",
    act: "Loser bracket",
    cue: "Los que perdieron se quedan. Los finalistas miran. Pausa más larga.",
    say: [
      "Perdiste.",
      "Todavía no te vas.",
      "Esto es el loser bracket.",
      "El que se la lleva, se queda con el tercero.",
      "El que no, se acaba acá.",
      "B contra D.",
    ],
    afterRoll: true,
    close: ["Gana ______.", "Tercer puesto."],
  },
  {
    id: "final",
    act: "Final",
    cue: "No se relée el papel. Solo vuelven tres líneas. El dado es el evento.",
    say: [
      "Final.",
      "A contra C.",
    ],
    afterRoll: true,
    beforeWhistle: [
      "Seis minutos.",
      "A menos que las cartas digan lo contrario.",
      "Que quede limpio.",
      "Que sea corto.",
      "Solo va a haber un ganador.",
    ],
    close: ["Gana ______."],
  },
  {
    id: "cierre",
    act: "Un ganador",
    cue: "El árbitro levanta un brazo. Cinco segundos. Los cuatro de pie, en la misma línea del principio.",
    say: [
      "Esto es el Torneo CAOS.",
      "Y solo iba a haber un ganador.",
      "Que el tatami tenga piedad de sus almas.",
      "Oss.",
    ],
  },
];

// Modelo de cómo se leen las cartas DESPUÉS del roleo. El host llena con
// lo que salió. No se explica: se lee.
export const CAOS_SCRIPT_ROLL = {
  cue: "Después de cada dado. Completá con lo que salió. No expliques.",
  terrain: [
    "Terreno: _______________.",
    "_______________.",
  ],
  duel: [
    "Duelo: _______________. Nivel _______.",
    "Arrancan: _______________.",
  ],
  sides: [
    "_______. Ventaja. _______________.",
    "Arranca _______________.",
    "_______. Carga. _______________.",
    "Arranca _______________.",
    "Si se la lleva, paga doble.",
  ],
  neutro: [
    "Duelo: _______________. Neutro.",
    "Los dos igual. No hay bono.",
  ],
  clock: [
    "Seis minutos.",
    "A menos que las cartas digan lo contrario.",
  ],
};
