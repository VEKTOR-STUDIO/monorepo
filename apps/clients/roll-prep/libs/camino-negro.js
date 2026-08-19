// ============================================================================
// CAMINO NEGRO — roguelike de decisiones de jiu-jitsu.
//
// Un juego, no un simulador. Pero cada regla sale de algo que pasa de verdad
// en el tatami, igual que el CAOS (ver libs/caos.js): la traducción es la
// gamificación, no la envoltura.
//
// LA CORRIDA (run)
//   Llegas de blanco a un gym que no conoces y tienes que sobrevivir tres
//   bloques hasta el examen. Cada noche eliges UN nodo entre dos o tres:
//   un tope, un dilema del gym, una clase técnica o un descanso. Lo que
//   escogiste no vuelve a aparecer: esa es la corrida.
//
//   Se pierde por tres topes perdidos o por caer contra un jefe. Se gana
//   pasando los tres jefes. No hay XP, no hay ranking: esto no toca la base
//   de datos ni la gamificación del gym. Se juega y ya.
//
// LA PELEA
//   Por turnos, con la posición como estado. El rival CANTA su intención
//   antes de cada asalto —como el que te avisa con la cadera lo que va a
//   hacer— y tú eliges qué responder. El triángulo manda:
//
//        MOVIMIENTO  vence a  PRESIÓN     (te mueves antes de que asiente)
//        PRESIÓN     vence a  ATAQUE      (el peso mata la sumisión)
//        ATAQUE      vence a  MOVIMIENTO  (te agarran cuando te sueltas)
//
//   El GAS es la vida. Todo cuesta gas, la presión se lo roba al otro y el
//   que llega a cero tapea de cansancio. Si suena el silbato sin sumisión,
//   deciden los puntos de verdad: derribo 2, barrida 2, pase 3, montada 4,
//   espalda 4.
//
// Todo lo de aquí es lógica pura y sin React: la UI (components/rollprep/
// CaminoNegro*.js) solo pinta lo que estas funciones devuelven, y el azar
// entra siempre por un `rng` inyectado para poder simular partidas.
// ============================================================================

export const JUEGO = {
  key: "camino-negro",
  name: "Camino Negro",
  tagline: "Tres bloques, un examen. El tatami decide.",
  version: 1,
};

// Clave del guardado local. Si cambian las reglas, sube la versión y las
// corridas viejas se descartan solas.
export const ALMACEN = `camino-negro:v${JUEGO.version}`;

// ----------------------------------------------------------------------------
// TIPOS DE ACCIÓN — el triángulo que decide los duelos de intención.
// ----------------------------------------------------------------------------
export const TIPOS = {
  presion: {
    label: "Presión",
    short: "PRE",
    tagline: "Peso, control, ahogo. Le roba gas al rival.",
    vence: "ataque",
    tono: "warning",
  },
  movimiento: {
    label: "Movimiento",
    short: "MOV",
    tagline: "Cadera, scramble, salida. Cambia la posición.",
    vence: "presion",
    tono: "info",
  },
  ataque: {
    label: "Ataque",
    short: "ATK",
    tagline: "Sumisión. Termina la pelea o te cuesta la posición.",
    vence: "movimiento",
    tono: "accent",
  },
  defensa: {
    label: "Defensa",
    short: "DEF",
    tagline: "Postura y respiración. No avanza, pero aguanta todo.",
    vence: null,
    tono: "neutral",
  },
};

// Cuánto pesa leer bien (o mal) la intención del rival.
const BONO_LECTURA = 18;
const CASTIGO_LECTURA = 14;
// La defensa nunca gana el duelo de tipos, pero aguanta parejo contra todo.
const BONO_DEFENSA = 10;
// Un agarre puesto o una postura rota: la ventaja se gasta en el asalto
// siguiente y se nota.
const BONO_VENTAJA = 15;
// Por debajo de este gas se pelea con la lengua afuera.
export const GAS_CRITICO = 25;
const CASTIGO_SIN_AIRE = 12;

/**
 * ¿El tipo `a` le gana al tipo `b`? La defensa no le gana a nadie.
 */
export function venceA(a, b) {
  return Boolean(a && b && TIPOS[a]?.vence === b);
}

// ----------------------------------------------------------------------------
// POSICIONES — la escalera del jiu-jitsu, vista desde el jugador.
//
// `valor` es lo dominante que es la posición (para la IA y para desempatar
// una decisión), y `espejo` es la misma posición física vista desde el otro
// lado: si yo estoy montado, el rival está debajo de la montada. Con eso el
// rival puede usar exactamente el mismo catálogo de movimientos que tú.
// ----------------------------------------------------------------------------
export const POSICIONES = {
  espalda_arriba: {
    valor: 5,
    name: "Espalda tomada",
    short: "Espalda",
    detalle: "Tienes la espalda con los dos ganchos puestos.",
    espejo: "espalda_abajo",
  },
  montada_arriba: {
    valor: 4,
    name: "Montada",
    short: "Montada",
    detalle: "Estás montado encima.",
    espejo: "montada_abajo",
  },
  lateral_arriba: {
    valor: 3,
    name: "Control lateral",
    short: "Lateral",
    detalle: "Cien kilos: guardia pasada, tú encima.",
    espejo: "lateral_abajo",
  },
  media_arriba: {
    valor: 2,
    name: "Media guardia (arriba)",
    short: "Media +",
    detalle: "Encima, con una pierna atrapada.",
    espejo: "media_abajo",
  },
  guardia_arriba: {
    valor: 1,
    name: "Dentro de la guardia",
    short: "Guardia +",
    detalle: "Arriba, pero metido en su guardia.",
    espejo: "guardia_abajo",
  },
  pie: {
    valor: 0,
    name: "De pie",
    short: "De pie",
    detalle: "Los dos parados, peleando el agarre.",
    espejo: "pie",
  },
  guardia_abajo: {
    valor: -1,
    name: "En guardia (abajo)",
    short: "Guardia −",
    detalle: "Abajo, con la guardia puesta y las piernas en juego.",
    espejo: "guardia_arriba",
  },
  media_abajo: {
    valor: -2,
    name: "Media guardia (abajo)",
    short: "Media −",
    detalle: "Abajo, aguantando con media guardia.",
    espejo: "media_arriba",
  },
  lateral_abajo: {
    valor: -3,
    name: "Debajo del lateral",
    short: "Lateral −",
    detalle: "Aplastado, con la guardia pasada.",
    espejo: "lateral_arriba",
  },
  montada_abajo: {
    valor: -4,
    name: "Debajo de la montada",
    short: "Montada −",
    detalle: "Te montaron. Se respira poco.",
    espejo: "montada_arriba",
  },
  espalda_abajo: {
    valor: -5,
    name: "Espalda entregada",
    short: "Espalda −",
    detalle: "Te tomaron la espalda. Manos al cuello.",
    espejo: "espalda_arriba",
  },
};

/**
 * La misma posición vista desde el otro lado del tatami.
 */
export function espejo(pos) {
  return POSICIONES[pos]?.espejo ?? "pie";
}

// ----------------------------------------------------------------------------
// MOVIMIENTOS
//
//   from     posiciones donde se puede intentar
//   tipo     su esquina del triángulo
//   gas      lo que cuesta intentarlo
//   base     probabilidad cruda, antes de atributos, lectura y defensa rival
//   a        posición donde caes si sale ("tap" = sumisión, null = te quedas)
//   puntos   los puntos de verdad del jiu-jitsu que paga la acción
//   attr     el atributo que lo potencia
//   drena    gas que le quitas al rival cuando sale
//   falla    a dónde caes si NO sale (las sumisiones se pagan caro)
//   ventaja  deja el agarre puesto: bono para tu siguiente acción
//   basico   lo sabe todo el mundo desde el primer día
// ----------------------------------------------------------------------------
export const MOVIMIENTOS = {
  // ---- El botón que siempre está ------------------------------------------
  defender: {
    name: "Postura y respirar",
    from: "todas",
    tipo: "defensa",
    gas: 5,
    base: 74,
    a: null,
    attr: "cardio",
    recupera: 7,
    basico: true,
    desc: "No avanzas: aguantas el asalto y recuperas aire.",
  },

  // ---- De pie --------------------------------------------------------------
  derribo_doble: {
    name: "Derribo doble",
    from: ["pie"],
    tipo: "movimiento",
    gas: 13,
    base: 58,
    a: "lateral_arriba",
    puntos: 2,
    attr: "explosividad",
    falla: "guardia_abajo",
    basico: true,
    desc: "Entras a las dos piernas y caes pasando.",
  },
  derribo_simple: {
    name: "Derribo simple",
    from: ["pie"],
    tipo: "movimiento",
    gas: 11,
    base: 64,
    a: "media_arriba",
    puntos: 2,
    attr: "explosividad",
    basico: true,
    desc: "Una pierna, caes en media guardia arriba.",
  },
  sentar_guardia: {
    name: "Sentarse a la guardia",
    from: ["pie"],
    tipo: "movimiento",
    gas: 4,
    base: 88,
    a: "guardia_abajo",
    attr: "tecnica",
    basico: true,
    desc: "Bajas tú la pelea. Barato y seguro, pero regalas el arriba.",
  },
  agarre_dominante: {
    name: "Pelear el agarre",
    from: ["pie"],
    tipo: "presion",
    gas: 7,
    base: 72,
    a: null,
    attr: "presion",
    drena: 7,
    ventaja: true,
    basico: true,
    desc: "Rompes su postura y pones el agarre: ventaja para el próximo.",
  },
  arrastre_de_brazo: {
    name: "Arrastre de brazo",
    from: ["pie", "guardia_abajo"],
    tipo: "movimiento",
    gas: 12,
    base: 44,
    a: "espalda_arriba",
    puntos: 4,
    attr: "tecnica",
    falla: "guardia_abajo",
    desc: "Arm drag limpio y aparece detrás. Difícil, pero paga la espalda.",
  },
  guillotina: {
    name: "Guillotina",
    from: ["pie", "guardia_abajo"],
    tipo: "ataque",
    gas: 12,
    base: 42,
    a: "tap",
    attr: "tecnica",
    falla: "lateral_abajo",
    desc: "Le cazas el cuello. Si se te escapa, te pasa la guardia.",
  },

  // ---- Arriba, dentro de la guardia ---------------------------------------
  abrir_guardia: {
    name: "Abrir la guardia",
    from: ["guardia_arriba"],
    tipo: "presion",
    gas: 8,
    base: 74,
    a: null,
    attr: "presion",
    drena: 8,
    ventaja: true,
    basico: true,
    desc: "Postura, rodilla adentro y a romper. Deja el pase servido.",
  },
  pase_toreando: {
    name: "Pase toreando",
    from: ["guardia_arriba"],
    tipo: "movimiento",
    gas: 12,
    base: 55,
    a: "lateral_arriba",
    puntos: 3,
    attr: "explosividad",
    falla: "guardia_abajo",
    basico: true,
    desc: "Pantalones arriba y a correr por fuera de las piernas.",
  },
  pase_presion: {
    name: "Pase de presión",
    from: ["guardia_arriba", "media_arriba"],
    tipo: "presion",
    gas: 14,
    base: 58,
    a: "lateral_arriba",
    puntos: 3,
    attr: "presion",
    drena: 10,
    desc: "Peso encima y avanzar centímetro a centímetro.",
  },
  pase_rodilla: {
    name: "Pase de rodilla",
    from: ["media_arriba"],
    tipo: "presion",
    gas: 12,
    base: 60,
    a: "lateral_arriba",
    puntos: 3,
    attr: "presion",
    drena: 6,
    basico: true,
    desc: "Knee cut: rodilla que corta y hombro que aplasta.",
  },

  // ---- Arriba, ya pasando --------------------------------------------------
  presion_hombro: {
    name: "Presión de hombro",
    from: ["lateral_arriba"],
    tipo: "presion",
    gas: 8,
    base: 80,
    a: null,
    attr: "presion",
    drena: 14,
    basico: true,
    desc: "No avanzas: le sacas el aire. El cansancio también finaliza.",
  },
  rodilla_barriga: {
    name: "Rodilla en la barriga",
    from: ["lateral_arriba"],
    tipo: "presion",
    gas: 9,
    base: 66,
    a: null,
    puntos: 2,
    attr: "presion",
    drena: 11,
    ventaja: true,
    desc: "Dos puntos, aire menos y el rival desesperado.",
  },
  montar: {
    name: "Montar",
    from: ["lateral_arriba"],
    tipo: "movimiento",
    gas: 11,
    base: 58,
    a: "montada_arriba",
    puntos: 4,
    attr: "tecnica",
    falla: "guardia_arriba",
    basico: true,
    desc: "Pasas la pierna. Cuatro puntos y la casa gana.",
  },
  kimura_lateral: {
    name: "Kimura desde el lateral",
    from: ["lateral_arriba"],
    tipo: "ataque",
    gas: 11,
    base: 46,
    a: "tap",
    attr: "tecnica",
    falla: "guardia_arriba",
    desc: "Le amarras el brazo contra el suelo y giras.",
  },
  darce: {
    name: "D'arce",
    from: ["lateral_arriba"],
    tipo: "ataque",
    gas: 12,
    base: 44,
    a: "tap",
    attr: "tecnica",
    falla: "guardia_arriba",
    desc: "Brazo adentro, cabeza afuera y a cerrar el triángulo de brazo.",
  },
  presion_montada: {
    name: "Aplastar desde la montada",
    from: ["montada_arriba"],
    tipo: "presion",
    gas: 8,
    base: 82,
    a: null,
    attr: "presion",
    drena: 15,
    basico: true,
    desc: "Piernas amarradas y pecho encima. Que se ahogue solo.",
  },
  tomar_espalda: {
    name: "Tomar la espalda",
    from: ["montada_arriba"],
    tipo: "movimiento",
    gas: 10,
    base: 62,
    a: "espalda_arriba",
    puntos: 4,
    attr: "tecnica",
    falla: "media_arriba",
    basico: true,
    desc: "Se gira para escapar y le entras por detrás.",
  },
  armbar_montada: {
    name: "Armbar desde la montada",
    from: ["montada_arriba"],
    tipo: "ataque",
    gas: 12,
    base: 50,
    a: "tap",
    attr: "tecnica",
    falla: "guardia_arriba",
    desc: "Aíslas el brazo y giras. Si falla, pierdes la montada.",
  },
  estrangulacion_cruzada: {
    name: "Estrangulación cruzada",
    from: ["montada_arriba"],
    tipo: "ataque",
    gas: 11,
    base: 47,
    a: "tap",
    attr: "tecnica",
    falla: "media_arriba",
    desc: "Las dos manos al cuello y codos adentro.",
  },
  mantener_ganchos: {
    name: "Cerrar el cinturón",
    from: ["espalda_arriba"],
    tipo: "presion",
    gas: 7,
    base: 84,
    a: null,
    attr: "presion",
    drena: 12,
    ventaja: true,
    basico: true,
    desc: "Ganchos y agarre de cinturón: no se va a ningún lado.",
  },
  mata_leon: {
    name: "Mata león",
    from: ["espalda_arriba"],
    tipo: "ataque",
    gas: 11,
    base: 58,
    a: "tap",
    attr: "tecnica",
    falla: "montada_arriba",
    basico: true,
    desc: "El brazo cruza el cuello y se acabó la conversación.",
  },

  // ---- Abajo, con guardia --------------------------------------------------
  romper_postura: {
    name: "Romper la postura",
    from: ["guardia_abajo"],
    tipo: "presion",
    gas: 7,
    base: 70,
    a: null,
    attr: "presion",
    drena: 7,
    ventaja: true,
    basico: true,
    desc: "Lo doblas hacia ti. Todo lo de abajo sale de aquí.",
  },
  subida_tecnica: {
    name: "Subida técnica",
    from: ["guardia_abajo", "media_abajo"],
    tipo: "movimiento",
    gas: 10,
    base: 68,
    a: "pie",
    attr: "explosividad",
    basico: true,
    desc: "Mano al suelo, cadera atrás y de pie otra vez.",
  },
  barrida_tijera: {
    name: "Barrida de tijera",
    from: ["guardia_abajo"],
    tipo: "movimiento",
    gas: 12,
    base: 54,
    a: "montada_arriba",
    puntos: 2,
    attr: "explosividad",
    falla: "media_abajo",
    basico: true,
    desc: "Tijera de piernas y apareces montado.",
  },
  barrida_cadera: {
    name: "Barrida de cadera",
    from: ["guardia_abajo"],
    tipo: "movimiento",
    gas: 10,
    base: 60,
    a: "media_arriba",
    puntos: 2,
    attr: "explosividad",
    basico: true,
    desc: "Hip bump: te sientas, empujas y quedas encima.",
  },
  triangulo: {
    name: "Triángulo",
    from: ["guardia_abajo"],
    tipo: "ataque",
    gas: 13,
    base: 48,
    a: "tap",
    attr: "tecnica",
    falla: "media_abajo",
    desc: "Un brazo adentro, uno afuera y las piernas cierran.",
  },
  armbar_guardia: {
    name: "Armbar desde la guardia",
    from: ["guardia_abajo"],
    tipo: "ataque",
    gas: 12,
    base: 46,
    a: "tap",
    attr: "tecnica",
    falla: "media_abajo",
    desc: "Le sacas el brazo por encima de la cabeza y giras.",
  },
  omoplata: {
    name: "Omoplata",
    from: ["guardia_abajo"],
    tipo: "ataque",
    gas: 12,
    base: 44,
    a: "tap",
    attr: "tecnica",
    falla: "pie",
    desc: "La pierna le enrolla el hombro. Si rueda, quedan de pie.",
  },
  enredo_de_piernas: {
    name: "Entrada a las piernas",
    from: ["guardia_abajo", "media_abajo"],
    tipo: "movimiento",
    gas: 9,
    base: 66,
    a: null,
    attr: "tecnica",
    ventaja: true,
    drena: 5,
    desc: "Ashi garami puesto: la pierna es tuya y el talón queda a tiro.",
  },
  talon: {
    name: "Llave de talón",
    from: ["guardia_abajo", "media_abajo"],
    tipo: "ataque",
    gas: 11,
    base: 43,
    a: "tap",
    attr: "tecnica",
    falla: "media_abajo",
    desc: "Rodilla atrapada, talón expuesto. Se acaba rápido o te pasan.",
  },
  berimbolo: {
    name: "Berimbolo",
    from: ["guardia_abajo"],
    tipo: "movimiento",
    gas: 14,
    base: 40,
    a: "espalda_arriba",
    puntos: 4,
    attr: "explosividad",
    falla: "lateral_abajo",
    desc: "Ruedas por debajo y sales por la espalda. O quedas aplastado.",
  },

  // ---- Abajo, en problemas -------------------------------------------------
  recomponer_guardia: {
    name: "Recomponer la guardia",
    from: ["media_abajo", "lateral_abajo"],
    tipo: "movimiento",
    gas: 10,
    base: 62,
    a: "guardia_abajo",
    attr: "tecnica",
    basico: true,
    desc: "Codo adentro, cadera afuera y la rodilla vuelve al medio.",
  },
  barrida_vieja: {
    name: "Barrida old school",
    from: ["media_abajo"],
    tipo: "movimiento",
    gas: 12,
    base: 52,
    a: "media_arriba",
    puntos: 2,
    attr: "explosividad",
    basico: true,
    desc: "Le enganchas el tobillo y lo tumbas hacia atrás.",
  },
  levantada: {
    name: "Levantada de dogfight",
    from: ["media_abajo"],
    tipo: "movimiento",
    gas: 12,
    base: 56,
    a: "pie",
    attr: "explosividad",
    desc: "Sales por debajo del brazo y te paras con él.",
  },
  puente_recomponer: {
    name: "Puente y marco",
    from: ["lateral_abajo"],
    tipo: "movimiento",
    gas: 11,
    base: 58,
    a: "media_abajo",
    attr: "explosividad",
    basico: true,
    desc: "Puente fuerte, marcos puestos y metes la rodilla.",
  },
  girar_salir: {
    name: "Girar y salir",
    from: ["lateral_abajo", "montada_abajo"],
    tipo: "movimiento",
    gas: 13,
    base: 44,
    a: "pie",
    attr: "explosividad",
    falla: "espalda_abajo",
    desc: "Te giras y sales corriendo. Si te lees mal, le das la espalda.",
  },
  puente_upa: {
    name: "Puente upa",
    from: ["montada_abajo"],
    tipo: "movimiento",
    gas: 13,
    base: 50,
    a: "guardia_abajo",
    attr: "explosividad",
    basico: true,
    desc: "Le atrapas el brazo, puenteas y giras: apareces arriba de él.",
  },
  codo_rodilla: {
    name: "Codo y rodilla",
    from: ["montada_abajo"],
    tipo: "movimiento",
    gas: 9,
    base: 62,
    a: "media_abajo",
    attr: "tecnica",
    basico: true,
    desc: "Escape lento y seguro: de la montada a la media guardia.",
  },
  defender_cuello: {
    name: "Defender el cuello",
    from: ["espalda_abajo"],
    tipo: "presion",
    gas: 7,
    base: 76,
    a: null,
    attr: "presion",
    recupera: 4,
    basico: true,
    desc: "Dos manos al cuello y barbilla pegada. Sobrevives el asalto.",
  },
  escapar_espalda: {
    name: "Sacar la espalda",
    from: ["espalda_abajo"],
    tipo: "movimiento",
    gas: 12,
    base: 52,
    a: "montada_abajo",
    attr: "tecnica",
    basico: true,
    desc: "Bajas por el hombro y pegas la espalda al suelo. Ya es algo.",
  },
};

// Las claves de todo lo que se sabe sin haber ido nunca a clase.
export const MOVIMIENTOS_BASICOS = Object.keys(MOVIMIENTOS).filter(
  (key) => MOVIMIENTOS[key].basico
);

/**
 * ¿Este movimiento se puede intentar desde esta posición?
 */
export function sirveEn(clave, pos) {
  const mov = MOVIMIENTOS[clave];
  if (!mov) return false;
  return mov.from === "todas" || mov.from.includes(pos);
}

/**
 * Los movimientos de un repertorio que se pueden usar en una posición,
 * ordenados como los pinta la UI: primero lo que avanza, la defensa al final.
 */
export function movimientosEn(pos, claves) {
  return claves
    .filter((clave) => sirveEn(clave, pos))
    .sort((a, b) => {
      const orden = { movimiento: 0, presion: 1, ataque: 2, defensa: 3 };
      return orden[MOVIMIENTOS[a].tipo] - orden[MOVIMIENTOS[b].tipo];
    });
}

// ----------------------------------------------------------------------------
// ESTILOS — con qué llegas al gym. Define atributos de arranque y las tres
// técnicas que ya traías de la casa.
//
//   tecnica       sumisiones y transiciones finas
//   presion       control, peso y robo de gas
//   explosividad  barridas, escapes y scrambles
//   cardio        tanque de gas y aguante
// ----------------------------------------------------------------------------
export const ATRIBUTOS = {
  tecnica: { label: "Técnica", short: "TEC" },
  presion: { label: "Presión", short: "PRE" },
  explosividad: { label: "Explosividad", short: "EXP" },
  cardio: { label: "Cardio", short: "CAR" },
};

export const ESTILOS = {
  guardero: {
    name: "Guardero",
    kicker: "Juega abajo",
    tagline: "Si te sientas, ya estás en tu casa.",
    atributos: { tecnica: 4, presion: 2, explosividad: 2, cardio: 2 },
    movimientos: ["triangulo", "armbar_guardia", "omoplata"],
  },
  presionador: {
    name: "Presionador",
    kicker: "Juega arriba",
    tagline: "No pasa rápido: pasa una vez y no se va más.",
    atributos: { tecnica: 2, presion: 4, explosividad: 2, cardio: 2 },
    movimientos: ["pase_presion", "kimura_lateral", "rodilla_barriga"],
  },
  luchador: {
    name: "Luchador",
    kicker: "Derriba y escapa",
    tagline: "El scramble es tu posición favorita.",
    atributos: { tecnica: 2, presion: 2, explosividad: 4, cardio: 2 },
    movimientos: ["girar_salir", "levantada", "guillotina"],
  },
  cazador: {
    name: "Cazador",
    kicker: "Va por las piernas",
    tagline: "Todo el mundo tiene talones. Nadie los cuida.",
    atributos: { tecnica: 4, presion: 1, explosividad: 3, cardio: 2 },
    movimientos: ["enredo_de_piernas", "talon", "berimbolo"],
  },
};

// ----------------------------------------------------------------------------
// DETALLES — los pasivos que se juntan por el camino. Son "ese detalle" que
// te corrige un profesor y ya no se te olvida más.
//
//   bonoTipo         suma a tu probabilidad según el tipo de acción
//   bonoArriba/Abajo suma cuando peleas por encima / por debajo
//   defensa          le resta probabilidad a TODO lo que intente el rival
//   contraSumision   le resta probabilidad solo a sus sumisiones
//   drena            gas extra que le robas cuando te sale algo
//   costoGas         te descuenta gas de cada acción (va en negativo)
//   gasMax           agranda el tanque al recogerlo
//   segundaVida      la primera sumisión de cada pelea la sobrevives
//   ventajaInicial   arrancas cada pelea con el agarre puesto
//   revelaRival      te deja ver la probabilidad real de la intención rival
//   recuperaTrasPelea gas que recuperas al terminar cada tope
// ----------------------------------------------------------------------------
export const DETALLES = {
  agarre_gorila: {
    name: "Agarre de gorila",
    desc: "Cuando agarras, no se suelta. +8 a todo lo que sea presión.",
    efecto: { bonoTipo: { presion: 8 } },
  },
  cadera_suelta: {
    name: "Cadera suelta",
    desc: "Te mueves como si no tuvieras huesos. +10 a los movimientos.",
    efecto: { bonoTipo: { movimiento: 10 } },
  },
  manos_de_alicate: {
    name: "Manos de alicate",
    desc: "El agarre de sumisión no se abre. +8 a los ataques.",
    efecto: { bonoTipo: { ataque: 8 } },
  },
  cuello_de_toro: {
    name: "Cuello de toro",
    desc: "Estrangularte cuesta el doble. −14 a las sumisiones del rival.",
    efecto: { contraSumision: 14 },
  },
  motor_diesel: {
    name: "Motor diésel",
    desc: "Ritmo constante toda la pelea. Cada acción cuesta 3 de gas menos.",
    efecto: { costoGas: -3 },
  },
  pulmon_de_montana: {
    name: "Pulmón de montaña",
    desc: "El tanque crece: +16 de gas máximo.",
    efecto: { gasMax: 16 },
  },
  pisada_de_plomo: {
    name: "Pisada de plomo",
    desc: "Donde te apoyas, duele. +5 de gas robado cada vez que te sale algo.",
    efecto: { drena: 5 },
  },
  oreja_de_coliflor: {
    name: "Oreja de coliflor",
    desc: "Kilometraje. +4 a absolutamente todo.",
    efecto: { bonoTipo: { presion: 4, movimiento: 4, ataque: 4, defensa: 4 } },
  },
  guardia_de_arana: {
    name: "Guardia de araña",
    desc: "Debajo eres otro. +9 cuando peleas por debajo.",
    efecto: { bonoAbajo: 9 },
  },
  presion_de_placa: {
    name: "Presión de placa",
    desc: "Encima pesas el doble. +9 cuando peleas por encima.",
    efecto: { bonoArriba: 9 },
  },
  salida_de_emergencia: {
    name: "Salida de emergencia",
    desc: "La primera sumisión de cada pelea la sacas. Una sola vez por pelea.",
    efecto: { segundaVida: true },
  },
  mentalidad_de_tope: {
    name: "Mentalidad de tope",
    desc: "Entras enchufado: arrancas cada pelea con el agarre puesto.",
    efecto: { ventajaInicial: true },
  },
  cinturon_apretado: {
    name: "Cinturón apretado",
    desc: "Te recuperas rápido: +12 de gas al terminar cada tope.",
    efecto: { recuperaTrasPelea: 12 },
  },
  reloj_interno: {
    name: "Reloj interno",
    desc: "Lees el ritmo del otro: ves cuánta chance tiene su intención. +4 de defensa.",
    efecto: { revelaRival: true, defensa: 4 },
  },
  cinta_en_los_dedos: {
    name: "Cinta en los dedos",
    desc: "Nada se rompe. −10 a las sumisiones del rival y +3 de defensa.",
    efecto: { contraSumision: 10, defensa: 3 },
  },
};

// ----------------------------------------------------------------------------
// LESIONES — lo que te vas trayendo. Se curan descansando.
// ----------------------------------------------------------------------------
export const LESIONES = {
  costilla: {
    name: "Costilla golpeada",
    desc: "Respiras a medias: −16 de gas máximo.",
    efecto: { gasMax: -16 },
  },
  dedo_gordo: {
    name: "Dedo del pie",
    desc: "No puedes apoyar bien: −9 a la presión.",
    efecto: { bonoTipo: { presion: -9 } },
  },
  rodilla: {
    name: "Rodilla inflamada",
    desc: "La cadera no responde: −10 a los movimientos.",
    efecto: { bonoTipo: { movimiento: -10 } },
  },
  cuello: {
    name: "Cuello trancado",
    desc: "Te encuentran el cuello fácil: +12 a las sumisiones del rival.",
    efecto: { contraSumision: -12 },
  },
  hombro: {
    name: "Hombro resentido",
    desc: "El agarre no aprieta igual: −9 a los ataques.",
    efecto: { bonoTipo: { ataque: -9 } },
  },
  codo: {
    name: "Codo hiperextendido",
    desc: "Duele hasta marcar: −6 a los ataques y −4 de defensa.",
    efecto: { bonoTipo: { ataque: -6 }, defensa: -4 },
  },
};

// ----------------------------------------------------------------------------
// RIVALES — cada uno con su vicio. `favoritos` es lo que busca siempre, y de
// ahí sale la intención que canta antes de cada asalto.
//
//   defensa  le resta a TU probabilidad
//   ataque   le suma a la suya
// ----------------------------------------------------------------------------
export const RIVALES = {
  blanco_nuevo: {
    name: "El blanco nuevo",
    kicker: "Cinturón blanco · 4 meses",
    tagline: "Fuerza de obrero, técnica de nadie. Aprieta todo lo que agarra.",
    gas: 116,
    defensa: 9,
    ataque: 11,
    movimientos: ["guillotina"],
    favoritos: ["derribo_doble", "girar_salir", "puente_upa", "guillotina"],
  },
  guardera: {
    name: "La guardera",
    kicker: "Cinturón azul",
    tagline: "Se sienta de una y desde ahí te vive atacando las piernas y el cuello.",
    gas: 96,
    defensa: 14,
    ataque: 13,
    movimientos: ["triangulo", "armbar_guardia", "omoplata"],
    favoritos: ["sentar_guardia", "triangulo", "armbar_guardia", "barrida_tijera"],
  },
  cazatalones: {
    name: "El cazatalones",
    kicker: "Cinturón azul · no-gi",
    tagline: "Todo lo resuelve abajo, enredado en tus piernas.",
    gas: 94,
    defensa: 13,
    ataque: 18,
    movimientos: ["enredo_de_piernas", "talon", "berimbolo"],
    favoritos: ["sentar_guardia", "enredo_de_piernas", "talon"],
  },
  aplastador: {
    name: "El aplastador",
    kicker: "Cinturón morado · 95 kg",
    tagline: "No pasa rápido. Pasa una vez y ya no te lo quitas de encima.",
    gas: 104,
    defensa: 17,
    ataque: 15,
    movimientos: ["pase_presion", "kimura_lateral", "rodilla_barriga"],
    favoritos: ["pase_presion", "presion_hombro", "rodilla_barriga", "montar"],
  },
  luchador_gym: {
    name: "El luchador",
    kicker: "Cinturón azul · viene de lucha",
    tagline: "Te derriba, te aguanta arriba y no se va al suelo ni amarrado.",
    gas: 110,
    defensa: 16,
    ataque: 15,
    movimientos: ["levantada", "girar_salir", "darce"],
    favoritos: ["derribo_doble", "derribo_simple", "presion_hombro", "levantada"],
  },
  elastico: {
    name: "El elástico",
    kicker: "Cinturón morado · gi",
    tagline: "Se invierte, rueda y aparece en tu espalda sin que sepas cómo.",
    gas: 92,
    defensa: 19,
    ataque: 15,
    movimientos: ["berimbolo", "arrastre_de_brazo", "omoplata"],
    favoritos: ["berimbolo", "arrastre_de_brazo", "tomar_espalda", "mata_leon"],
  },
  el_grande: {
    name: "El grande",
    kicker: "Cinturón morado · 120 kg",
    tagline: "No hay técnica que arregle 40 kilos de diferencia. Solo movimiento.",
    gas: 120,
    defensa: 20,
    ataque: 17,
    movimientos: ["pase_presion", "kimura_lateral"],
    favoritos: ["presion_hombro", "presion_montada", "pase_presion", "montar"],
  },
  visitante: {
    name: "El visitante",
    kicker: "Cinturón marrón · otro gym",
    tagline: "Vino a medirse. Nadie sabe qué juega hasta que ya te pasó.",
    gas: 108,
    defensa: 21,
    ataque: 19,
    movimientos: ["pase_toreando", "kimura_lateral", "triangulo", "arrastre_de_brazo"],
    favoritos: ["pase_toreando", "montar", "kimura_lateral"],
  },

  // ---- Jefes ---------------------------------------------------------------
  veterano: {
    name: "El veterano",
    kicker: "JEFE · Cinturón marrón · 12 años",
    tagline:
      "Lleva más tiempo en el tatami que tú vivo en la ciudad. No se apura y no se cansa.",
    jefe: true,
    gas: 128,
    defensa: 18,
    ataque: 17,
    movimientos: [
      "pase_presion",
      "kimura_lateral",
      "rodilla_barriga",
      "armbar_montada",
    ],
    favoritos: ["pase_presion", "presion_hombro", "montar", "kimura_lateral"],
  },
  competidora: {
    name: "La competidora",
    kicker: "JEFE · Cinturón marrón · circuito",
    tagline: "Pelea por puntos, con reloj en la cabeza. Te gana 6 a 0 y ni sudó.",
    jefe: true,
    gas: 120,
    defensa: 22,
    ataque: 20,
    movimientos: [
      "pase_toreando",
      "tomar_espalda",
      "armbar_montada",
      "barrida_tijera",
      "arrastre_de_brazo",
    ],
    favoritos: ["pase_toreando", "montar", "tomar_espalda", "barrida_tijera"],
  },
  profesor: {
    name: "El profesor",
    kicker: "JEFE · Cinturón negro · 3er grado",
    tagline:
      "Sabe qué vas a hacer antes que tú. El examen no es ganarle: es durarle.",
    jefe: true,
    gas: 134,
    defensa: 24,
    ataque: 24,
    movimientos: [
      "pase_presion",
      "pase_toreando",
      "kimura_lateral",
      "armbar_montada",
      "estrangulacion_cruzada",
      "triangulo",
      "arrastre_de_brazo",
      "darce",
    ],
    favoritos: ["pase_presion", "montar", "tomar_espalda", "mata_leon", "darce"],
  },
};

// ----------------------------------------------------------------------------
// BLOQUES — los tres actos de la corrida. Cada uno son cuatro noches a elegir
// y una quinta que no se elige: el jefe.
// ----------------------------------------------------------------------------
export const BLOQUES = [
  {
    key: "gym",
    nombre: "El gym de la esquina",
    tagline: "Martes y jueves. Nadie te conoce todavía.",
    nodos: 4,
    jefe: "veterano",
    rivales: ["blanco_nuevo", "guardera", "luchador_gym", "cazatalones"],
  },
  {
    key: "circuito",
    nombre: "El circuito",
    tagline: "Sales del gym. Aquí sí te miran el cinturón.",
    nodos: 4,
    jefe: "competidora",
    rivales: ["aplastador", "elastico", "luchador_gym", "cazatalones", "guardera"],
  },
  {
    key: "examen",
    nombre: "El examen",
    tagline: "El profesor te puso en la lista. Falta que aguantes.",
    nodos: 4,
    jefe: "profesor",
    rivales: ["el_grande", "visitante", "aplastador", "elastico"],
  },
];

// ----------------------------------------------------------------------------
// DECISIONES — la mitad del juego que no se pelea.
//
// Ninguna opción es gratis y ninguna es la correcta siempre: son los mismos
// dilemas de cualquiera que entrena en serio. Las que llevan `riesgo` se
// juegan a los dados, como en la vida.
// ----------------------------------------------------------------------------
export const EVENTOS = [
  {
    key: "el_grandote",
    titulo: "El grandote del open mat",
    kicker: "Open mat",
    texto:
      "Se para frente a ti el más pesado del gym y te ofrece el puño. Te saca 35 kilos y una sonrisa.",
    opciones: [
      {
        etiqueta: "Rolar y aguantar",
        detalle: "A ver qué se aprende debajo de eso.",
        riesgo: {
          chance: 55,
          exito: {
            texto: "Sobreviviste seis minutos debajo. Aprendiste a respirar aplastado.",
            efecto: { presion: 1, gas: -14 },
          },
          fallo: {
            texto: "Te cayó encima con todo el peso en el momento equivocado.",
            efecto: { gas: -18, lesion: "azar" },
          },
        },
      },
      {
        etiqueta: "Pedirle ritmo suave",
        detalle: "Flow roll, sin apretar.",
        efecto: { tecnica: 1, gas: -6 },
      },
      {
        etiqueta: "Decir que no y hacer drills",
        detalle: "Repeticiones solo, sin resistencia.",
        efecto: { gas: 14 },
      },
    ],
  },
  {
    key: "no_sale",
    titulo: "La técnica no te sale",
    kicker: "Clase",
    texto:
      "Es la tercera clase seguida con el mismo pase y sigues cayendo en media guardia. El compañero ya ni disimula.",
    opciones: [
      {
        etiqueta: "Cien repeticiones más",
        detalle: "Machacarla hasta que salga sola.",
        efecto: { tecnica: 1, gas: -12 },
      },
      {
        etiqueta: "Preguntarle el detalle al profe",
        detalle: "Dos minutos de corrección personalizada.",
        efecto: { detalle: "azar", gas: -6 },
      },
      {
        etiqueta: "Volver a lo que sí te sale",
        detalle: "Jugar tu juego y ya.",
        efecto: { explosividad: 1 },
      },
    ],
  },
  {
    key: "llegaste_tarde",
    titulo: "Llegaste tarde",
    kicker: "20:14",
    texto:
      "El calentamiento ya pasó y están armando parejas para el tope. El profe te mira y levanta la ceja.",
    opciones: [
      {
        etiqueta: "Entrar en frío",
        detalle: "Directo al tope, sin calentar.",
        riesgo: {
          chance: 50,
          exito: {
            texto: "Entraste frío y saliste entero. Esta vez.",
            efecto: { explosividad: 1, gas: -8 },
          },
          fallo: {
            texto: "A los dos minutos algo hizo un ruido feo.",
            efecto: { gas: -10, lesion: "azar" },
          },
        },
      },
      {
        etiqueta: "Calentar solo en la esquina",
        detalle: "Pierdes dos rondas, entras entero.",
        efecto: { gas: -6, cardio: 1 },
      },
      {
        etiqueta: "Sentarte a ver la clase",
        detalle: "Mirar también es entrenar.",
        efecto: { tecnica: 1, gas: 12 },
      },
    ],
  },
  {
    key: "aprieta_de_mas",
    titulo: "El compañero aprieta de más",
    kicker: "Tope",
    texto:
      "Te enganchó una kimura y en vez de esperar el tap, la subió de un tirón. Ya van dos veces esta semana.",
    opciones: [
      {
        etiqueta: "Tapear temprano y seguir",
        detalle: "El brazo es tuyo, el ego no vale nada.",
        efecto: { gas: 8, tecnica: 1 },
      },
      {
        etiqueta: "Aguantar la llave",
        detalle: "No le vas a dar el gusto.",
        riesgo: {
          chance: 40,
          exito: {
            texto: "Saliste de adentro de la kimura. Él no lo va a olvidar.",
            efecto: { presion: 1 },
          },
          fallo: {
            texto: "Sonó el codo. Tapeaste tarde.",
            efecto: { lesion: "codo" },
          },
        },
      },
      {
        etiqueta: "Hablarlo al terminar",
        detalle: "Sin drama: bájale dos.",
        efecto: { detalle: "azar" },
      },
    ],
  },
  {
    key: "seminario",
    titulo: "Seminario del sábado",
    kicker: "Fin de semana",
    texto:
      "Viene un cinturón negro de afuera. Cuatro horas, cuesta plata y al día siguiente no te vas a poder mover.",
    opciones: [
      {
        etiqueta: "Ir y anotarlo todo",
        detalle: "Libreta, video, preguntas.",
        efecto: { tecnica: 2, gas: -20 },
      },
      {
        etiqueta: "Ir solo a la parte de rolar",
        detalle: "Llegar a la hora del open mat.",
        efecto: { explosividad: 1, gas: -10 },
      },
      {
        etiqueta: "Quedarte durmiendo",
        detalle: "El cuerpo también pide.",
        efecto: { gas: 26 },
      },
    ],
  },
  {
    key: "video_2am",
    titulo: "Instagram a las 2 de la mañana",
    kicker: "Casa",
    texto:
      "Un detalle del pase te llevó a otro, y ese a otro. Son las dos y mañana entrenas.",
    opciones: [
      {
        etiqueta: "Estudiar hasta las cuatro",
        detalle: "Estás a punto de entenderlo.",
        efecto: { tecnica: 1, gas: -16 },
      },
      {
        etiqueta: "Un detalle y a dormir",
        detalle: "Disciplina.",
        riesgo: {
          chance: 65,
          exito: {
            texto: "Un video, teléfono abajo, ocho horas. Amaneciste nuevo.",
            efecto: { tecnica: 1, gas: 8 },
          },
          fallo: {
            texto: "Un video se volvieron once. Otra vez.",
            efecto: { gas: -10 },
          },
        },
      },
      {
        etiqueta: "Soltar el teléfono ya",
        detalle: "Dormir es entrenar.",
        efecto: { gas: 20 },
      },
    ],
  },
  {
    key: "dar_la_clase",
    titulo: "El profe te pone a dar la clase",
    kicker: "Responsabilidad",
    texto:
      "Se le dañó el carro y te escribe: dale tú el calentamiento y la técnica de hoy. Hay ocho blancos esperando.",
    opciones: [
      {
        etiqueta: "Dar la clase completa",
        detalle: "Explicar obliga a entender.",
        efecto: { tecnica: 1, presion: 1, gas: -14 },
      },
      {
        etiqueta: "Poner solo el calentamiento y rolar",
        detalle: "Lo mínimo, y a lo tuyo.",
        efecto: { cardio: 1, gas: -6 },
      },
    ],
  },
  {
    key: "corte_de_peso",
    titulo: "Faltan dos kilos",
    kicker: "Pesaje",
    texto:
      "El torneo es el sábado y la balanza no perdona. O bajas, o subes de categoría y peleas contra gente más grande.",
    opciones: [
      {
        etiqueta: "Cortar los dos kilos",
        detalle: "Sauna, agua y fe.",
        efecto: { explosividad: 1, gasMax: -10 },
      },
      {
        etiqueta: "Subir de categoría",
        detalle: "Comer normal y pelear con los grandes.",
        efecto: { presion: 1, gas: -6 },
      },
      {
        etiqueta: "No competir esta vez",
        detalle: "Quedarte entrenando tranquilo.",
        efecto: { gas: 22, tecnica: 1 },
      },
    ],
  },
  {
    key: "rincon_leglocks",
    titulo: "El rincón de las piernas",
    kicker: "No-gi",
    texto:
      "Los del no-gi se quedan una hora más enredados de piernas. Te hacen señas para que caigas.",
    opciones: [
      {
        etiqueta: "Meterte una semana completa",
        detalle: "Aprender lo que te da miedo.",
        efecto: { movimiento: "azar", gas: -12 },
      },
      {
        etiqueta: "Solo mirar y preguntar",
        detalle: "Entender la defensa primero.",
        efecto: { tecnica: 1 },
      },
      {
        etiqueta: "Irte a estirar",
        detalle: "Las piernas se cuidan, no se regalan.",
        efecto: { gas: 16 },
      },
    ],
  },
  {
    key: "seis_topes",
    titulo: "Seis topes seguidos",
    kicker: "Viernes",
    texto:
      "El profe puso ronda larga: seis de cinco minutos sin descanso. Al cuarto ya no sientes las manos.",
    opciones: [
      {
        etiqueta: "Pelear los seis",
        detalle: "Ahí es donde se construye el tanque.",
        efecto: { cardio: 1, gas: -26 },
      },
      {
        etiqueta: "Pelear tres y mirar tres",
        detalle: "Calidad sobre cantidad.",
        efecto: { tecnica: 1, gas: -10 },
      },
      {
        etiqueta: "Salirte a la mitad",
        detalle: "Guardar el cuerpo para el sábado.",
        efecto: { gas: 6 },
      },
    ],
  },
  {
    key: "grabar_el_tope",
    titulo: "Grabaste el tope",
    kicker: "Video",
    texto:
      "Pusiste el teléfono en la esquina. En la grabación se ve clarito el error que llevas tres meses repitiendo.",
    opciones: [
      {
        etiqueta: "Verlo completo y anotarlo",
        detalle: "Duele, pero se arregla.",
        efecto: { detalle: "azar", gas: -6 },
      },
      {
        etiqueta: "Mandárselo al profe",
        detalle: "Que lo vea alguien que sepa.",
        efecto: { tecnica: 2, gas: -4 },
      },
    ],
  },
  {
    key: "fisio",
    titulo: "La cita con el fisio",
    kicker: "Recuperación",
    texto:
      "Tienes turno mañana a las siete. Cuesta lo de dos meses de mensualidad y te vas a perder la clase.",
    requiere: "lesion",
    opciones: [
      {
        etiqueta: "Ir y hacer el tratamiento",
        detalle: "Perder una semana para no perder tres meses.",
        efecto: { quitarLesion: true, gas: -8 },
      },
      {
        etiqueta: "Aguantar con hielo y cinta",
        detalle: "Ya se pasará.",
        efecto: { gas: 10 },
      },
    ],
  },
  {
    key: "cinturon_nuevo",
    titulo: "Te dieron el grado",
    kicker: "Ceremonia",
    texto:
      "El profe te llama al frente y te pone la cinta. De golpe todos los blancos quieren rolar contigo.",
    opciones: [
      {
        etiqueta: "Aceptar todos los retos",
        detalle: "A defender la cinta.",
        efecto: { presion: 1, gas: -14 },
      },
      {
        etiqueta: "Seguir peleando con los más duros",
        detalle: "El grado no cambia nada.",
        efecto: { tecnica: 1, cardio: 1, gas: -8 },
      },
    ],
  },
  {
    key: "el_ego",
    titulo: "El blanco nuevo te pasó la guardia",
    kicker: "Ego",
    texto:
      "Tiene cuatro meses, veinte kilos más y te acaba de pasar limpio delante de todo el mundo.",
    opciones: [
      {
        etiqueta: "Subir la intensidad",
        detalle: "Que se le quite lo atrevido.",
        riesgo: {
          chance: 50,
          exito: {
            texto: "Lo finalizaste tres veces seguidas. El gym vio.",
            efecto: { explosividad: 1, gas: -12 },
          },
          fallo: {
            texto: "Peleaste con rabia, no con cabeza. Te llevaste un dedo torcido.",
            efecto: { gas: -12, lesion: "dedo_gordo" },
          },
        },
      },
      {
        etiqueta: "Dejarlo pasar y estudiar el error",
        detalle: "El pase funcionó. Eso es información.",
        efecto: { tecnica: 1, gas: 6 },
      },
    ],
  },
  {
    key: "agua_y_sueno",
    titulo: "La semana pesada",
    kicker: "Cuerpo",
    texto:
      "Trabajo, tráfico y tres entrenamientos. Te levantaste sin ganas por primera vez en meses.",
    opciones: [
      {
        etiqueta: "Ir igual, aunque sea a mirar",
        detalle: "La constancia es el juego largo.",
        efecto: { tecnica: 1, gas: -4 },
      },
      {
        etiqueta: "Parar dos días completos",
        detalle: "Comer, dormir, nada más.",
        efecto: { gas: 30, gasMax: 4 },
      },
    ],
  },
  {
    key: "el_detalle",
    titulo: "El detalle de siempre",
    kicker: "Corrección",
    texto:
      "El profe te para en medio del tope, te acomoda el codo dos centímetros y todo cambia.",
    opciones: [
      {
        etiqueta: "Repetirlo hasta que quede",
        detalle: "Que se pegue al cuerpo.",
        efecto: { detalle: "azar", gas: -10 },
      },
      {
        etiqueta: "Anotarlo y seguir rolando",
        detalle: "Ya lo trabajaré en casa.",
        efecto: { tecnica: 1, gas: -2 },
      },
    ],
  },
];

export const EVENTO_POR_KEY = Object.fromEntries(
  EVENTOS.map((evento) => [evento.key, evento])
);

// ============================================================================
// AZAR
//
// Todo el azar entra por una función inyectable: la corrida se genera con una
// semilla (misma semilla = mismo mapa) y la pelea usa Math.random salvo que
// se le pase otra cosa, que es como se simulan miles de peleas para calibrar.
// ============================================================================

/**
 * Generador con semilla (mulberry32). Devuelve una función tipo Math.random.
 */
export function crearAzar(semilla = Date.now()) {
  let estado = semilla >>> 0;
  return function azar() {
    estado |= 0;
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tomar(lista, azar) {
  return lista[Math.floor(azar() * lista.length)];
}

function mezclar(lista, azar) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function pesado(entradas, azar) {
  const total = entradas.reduce((suma, e) => suma + e.peso, 0);
  if (total <= 0) return entradas[0]?.valor ?? null;
  let corte = azar() * total;
  for (const entrada of entradas) {
    corte -= entrada.peso;
    if (corte <= 0) return entrada.valor;
  }
  return entradas[entradas.length - 1].valor;
}

const limitar = (n, min, max) => Math.max(min, Math.min(max, n));

// ============================================================================
// LA CORRIDA
// ============================================================================

// Topes perdidos que aguanta una corrida antes de que el gym te quiebre.
export const MARCAS_MAXIMAS = 3;

// Qué se ofrece en cada noche del bloque. La última antes del jefe siempre
// deja preparar: técnica o descanso.
const PLANTILLAS = [
  ["tope", "evento"],
  ["tope", "dojo"],
  ["tope", "evento", "descanso"],
  ["tope", "dojo", "descanso"],
];

export const TIPOS_DE_NODO = {
  tope: { label: "Tope", kicker: "Pelea" },
  jefe: { label: "Jefe", kicker: "Pelea" },
  evento: { label: "Decisión", kicker: "Gym" },
  dojo: { label: "Clase técnica", kicker: "Dojo" },
  descanso: { label: "Descanso", kicker: "Cuerpo" },
};

function generarMapa(azar) {
  const bolsaEventos = mezclar(
    EVENTOS.map((evento) => evento.key),
    azar
  );
  let ie = 0;

  return BLOQUES.map((bloque) => {
    const bolsaRivales = mezclar(bloque.rivales, azar);
    let ir = 0;

    const pasos = PLANTILLAS.map((tipos) => ({
      opciones: mezclar(tipos, azar).map((tipo) => {
        if (tipo === "tope") {
          return { tipo, rival: bolsaRivales[ir++ % bolsaRivales.length] };
        }
        if (tipo === "evento") {
          return { tipo, evento: bolsaEventos[ie++ % bolsaEventos.length] };
        }
        return { tipo };
      }),
    }));

    pasos.push({
      jefe: true,
      opciones: [{ tipo: "jefe", rival: bloque.jefe }],
    });

    return { key: bloque.key, pasos };
  });
}

/**
 * Suma en un solo objeto todo lo que aportan detalles y lesiones. Es lo que
 * consulta la matemática de la pelea: nadie lee DETALLES/LESIONES directo.
 */
export function modificadores(corrida) {
  const mods = {
    bonoTipo: { presion: 0, movimiento: 0, ataque: 0, defensa: 0 },
    bonoArriba: 0,
    bonoAbajo: 0,
    defensa: 0,
    contraSumision: 0,
    drena: 0,
    costoGas: 0,
    gasMax: 0,
    segundaVida: false,
    ventajaInicial: false,
    revelaRival: false,
    recuperaTrasPelea: 0,
  };

  const fuentes = [
    ...(corrida.detalles ?? []).map((key) => DETALLES[key]?.efecto),
    ...(corrida.lesiones ?? []).map((key) => LESIONES[key]?.efecto),
  ].filter(Boolean);

  for (const efecto of fuentes) {
    for (const [tipo, valor] of Object.entries(efecto.bonoTipo ?? {})) {
      mods.bonoTipo[tipo] += valor;
    }
    mods.bonoArriba += efecto.bonoArriba ?? 0;
    mods.bonoAbajo += efecto.bonoAbajo ?? 0;
    mods.defensa += efecto.defensa ?? 0;
    mods.contraSumision += efecto.contraSumision ?? 0;
    mods.drena += efecto.drena ?? 0;
    mods.costoGas += efecto.costoGas ?? 0;
    mods.gasMax += efecto.gasMax ?? 0;
    mods.recuperaTrasPelea += efecto.recuperaTrasPelea ?? 0;
    mods.segundaVida = mods.segundaVida || Boolean(efecto.segundaVida);
    mods.ventajaInicial = mods.ventajaInicial || Boolean(efecto.ventajaInicial);
    mods.revelaRival = mods.revelaRival || Boolean(efecto.revelaRival);
  }

  return mods;
}

/**
 * El tanque: base + cardio + lo que sumen o resten detalles, lesiones y
 * decisiones pasadas.
 */
export function gasMaximo(corrida) {
  const mods = modificadores(corrida);
  return Math.max(
    40,
    90 + (corrida.atributos?.cardio ?? 0) * 8 + mods.gasMax + (corrida.gasExtra ?? 0)
  );
}

/**
 * Lo que le cuesta al rival entrarte: cuanto más técnico y más entero estés,
 * menos le sale todo.
 */
export function defensaJugador(corrida) {
  const mods = modificadores(corrida);
  return (
    8 +
    (corrida.atributos?.tecnica ?? 0) * 2 +
    (corrida.atributos?.cardio ?? 0) * 2 +
    mods.defensa
  );
}

/**
 * Arranca una corrida nueva. Misma semilla = mismo mapa.
 */
export function nuevaCorrida(estiloKey = "guardero", semilla = Date.now()) {
  const estilo = ESTILOS[estiloKey] ? estiloKey : "guardero";
  const azar = crearAzar(semilla);

  const corrida = {
    version: JUEGO.version,
    semilla,
    estilo,
    atributos: { ...ESTILOS[estilo].atributos },
    movimientos: [...MOVIMIENTOS_BASICOS, ...ESTILOS[estilo].movimientos],
    detalles: [],
    lesiones: [],
    gasExtra: 0,
    marcas: 0,
    bloque: 0,
    paso: 0,
    peleas: 0,
    victorias: 0,
    sumisiones: 0,
    eventosVistos: [],
    mapa: generarMapa(azar),
    fin: null,
  };

  corrida.gas = gasMaximo(corrida);
  return corrida;
}

export function bloqueActual(corrida) {
  return BLOQUES[corrida.bloque] ?? BLOQUES[BLOQUES.length - 1];
}

export function pasoActual(corrida) {
  return corrida.mapa[corrida.bloque]?.pasos[corrida.paso] ?? null;
}

/**
 * Cierra la noche y pasa a la siguiente. Si se acabó el último bloque, la
 * corrida se gana: pasaste el examen.
 */
export function avanzar(corrida) {
  const siguiente = { ...corrida, paso: corrida.paso + 1 };
  const pasos = corrida.mapa[corrida.bloque]?.pasos.length ?? 0;

  if (siguiente.paso >= pasos) {
    siguiente.paso = 0;
    siguiente.bloque = corrida.bloque + 1;
  }

  if (siguiente.bloque >= BLOQUES.length) {
    siguiente.bloque = BLOQUES.length - 1;
    siguiente.fin = {
      resultado: "victoria",
      titulo: "Te dieron el grado",
      texto:
        "Pasaste los tres bloques y aguantaste al profesor. El camino no se acaba aquí, pero esta corrida es tuya.",
    };
  }

  return siguiente;
}

// ============================================================================
// EFECTOS — lo único que puede tocar la ficha del jugador.
// ============================================================================

const CLAVES_ATRIBUTO = Object.keys(ATRIBUTOS);

/**
 * Aplica un efecto de evento, botín o descanso. Devuelve la corrida nueva y
 * las líneas que la UI tiene que cantar.
 */
export function aplicarEfecto(corrida, efecto = {}, azar = Math.random) {
  let nueva = {
    ...corrida,
    atributos: { ...corrida.atributos },
    movimientos: [...corrida.movimientos],
    detalles: [...corrida.detalles],
    lesiones: [...corrida.lesiones],
  };
  const mensajes = [];

  for (const attr of CLAVES_ATRIBUTO) {
    if (!efecto[attr]) continue;
    nueva.atributos[attr] = Math.max(0, nueva.atributos[attr] + efecto[attr]);
    mensajes.push({
      tono: efecto[attr] > 0 ? "bien" : "mal",
      texto: `${ATRIBUTOS[attr].label} ${efecto[attr] > 0 ? "+" : ""}${efecto[attr]}`,
    });
  }

  if (efecto.gasMax) {
    nueva.gasExtra = (nueva.gasExtra ?? 0) + efecto.gasMax;
    mensajes.push({
      tono: efecto.gasMax > 0 ? "bien" : "mal",
      texto: `Gas máximo ${efecto.gasMax > 0 ? "+" : ""}${efecto.gasMax}`,
    });
  }

  if (efecto.detalle) {
    const libres = Object.keys(DETALLES).filter(
      (key) => !nueva.detalles.includes(key)
    );
    const key = efecto.detalle === "azar" ? tomar(libres, azar) : efecto.detalle;
    if (key && !nueva.detalles.includes(key)) {
      nueva.detalles.push(key);
      mensajes.push({ tono: "bien", texto: `Detalle nuevo: ${DETALLES[key].name}` });
    } else {
      efecto = { ...efecto, gas: (efecto.gas ?? 0) + 10 };
      mensajes.push({ tono: "neutro", texto: "Ya lo sabías todo. Aire de más." });
    }
  }

  if (efecto.movimiento) {
    const libres = Object.keys(MOVIMIENTOS).filter(
      (key) => !nueva.movimientos.includes(key)
    );
    const key =
      efecto.movimiento === "azar" ? tomar(libres, azar) : efecto.movimiento;
    if (key && !nueva.movimientos.includes(key)) {
      nueva.movimientos.push(key);
      mensajes.push({
        tono: "bien",
        texto: `Técnica nueva: ${MOVIMIENTOS[key].name}`,
      });
    }
  }

  if (efecto.lesion) {
    const libres = Object.keys(LESIONES).filter(
      (key) => !nueva.lesiones.includes(key)
    );
    const key = efecto.lesion === "azar" ? tomar(libres, azar) : efecto.lesion;
    if (key && !nueva.lesiones.includes(key)) {
      nueva.lesiones.push(key);
      mensajes.push({ tono: "mal", texto: `Lesión: ${LESIONES[key].name}` });
    } else {
      efecto = { ...efecto, gas: (efecto.gas ?? 0) - 8 };
      mensajes.push({ tono: "mal", texto: "Otro golpe encima de lo mismo." });
    }
  }

  if (efecto.quitarLesion && nueva.lesiones.length) {
    const key = nueva.lesiones[0];
    nueva.lesiones = nueva.lesiones.filter((l) => l !== key);
    mensajes.push({ tono: "bien", texto: `Curado: ${LESIONES[key].name}` });
  }

  if (efecto.curarTodo && nueva.lesiones.length) {
    mensajes.push({
      tono: "bien",
      texto: `Curado: ${nueva.lesiones.map((k) => LESIONES[k].name).join(", ")}`,
    });
    nueva.lesiones = [];
  }

  const techo = gasMaximo(nueva);
  if (efecto.gas) {
    nueva.gas = limitar(nueva.gas + efecto.gas, 0, techo);
    mensajes.push({
      tono: efecto.gas > 0 ? "bien" : "mal",
      texto: `Gas ${efecto.gas > 0 ? "+" : ""}${efecto.gas}`,
    });
  }
  // El techo pudo bajar (costilla, corte de peso): el tanque no puede quedar
  // por encima de lo que aguanta el cuerpo.
  nueva.gas = limitar(nueva.gas, 0, techo);

  return { corrida: nueva, mensajes };
}

/**
 * Resuelve una opción de evento: si lleva `riesgo`, tira los dados primero.
 */
export function resolverOpcion(corrida, opcion, azar = Math.random) {
  if (!opcion.riesgo) {
    const { corrida: nueva, mensajes } = aplicarEfecto(corrida, opcion.efecto, azar);
    return { corrida: nueva, mensajes, texto: opcion.detalle, salio: null };
  }

  const salio = azar() * 100 < opcion.riesgo.chance;
  const rama = salio ? opcion.riesgo.exito : opcion.riesgo.fallo;
  const { corrida: nueva, mensajes } = aplicarEfecto(corrida, rama.efecto, azar);

  return { corrida: nueva, mensajes, texto: rama.texto, salio };
}

/**
 * El evento que toca en este nodo. Si el del mapa pide algo que no se cumple
 * (el fisio sin lesión) o ya salió, se cambia por otro.
 *
 * A propósito NO usa azar: la carta del mapa enseña el título antes de que
 * elijas, así que la respuesta tiene que ser la misma al pintarla y al
 * entrar. El desempate sale de la semilla y de dónde estás parado.
 */
export function eventoDelNodo(corrida, nodo) {
  const sirve = (key) => {
    const evento = EVENTO_POR_KEY[key];
    if (!evento) return false;
    if (evento.requiere === "lesion" && !corrida.lesiones.length) return false;
    return true;
  };

  if (sirve(nodo.evento) && !corrida.eventosVistos.includes(nodo.evento)) {
    return nodo.evento;
  }

  const indice = (key) => {
    const salto = Math.abs(corrida.semilla + corrida.bloque * 7 + corrida.paso * 13);
    return salto % Math.max(1, key.length);
  };

  const libres = EVENTOS.filter(
    (evento) => sirve(evento.key) && !corrida.eventosVistos.includes(evento.key)
  );
  if (libres.length) return libres[indice(libres)].key;
  if (sirve(nodo.evento)) return nodo.evento;

  const sueltos = EVENTOS.filter((evento) => !evento.requiere);
  return sueltos[indice(sueltos)].key;
}

/**
 * Las tres técnicas que ofrece una clase del dojo (o las que queden).
 */
export function ofertaDeDojo(corrida, azar = Math.random) {
  const libres = Object.keys(MOVIMIENTOS).filter(
    (key) => !corrida.movimientos.includes(key)
  );
  return mezclar(libres, azar).slice(0, 3);
}

/**
 * Un descanso siempre ofrece lo mismo: aire, cuerpo o cabeza. Curar solo
 * aparece si hay algo que curar.
 */
export function opcionesDeDescanso(corrida) {
  const opciones = [
    {
      key: "aire",
      etiqueta: "Dormir y comer bien",
      detalle: "Recuperas 45 de gas.",
      efecto: { gas: 45 },
    },
    {
      key: "cuerpo",
      etiqueta: "Gimnasio y movilidad",
      detalle: "+8 de gas máximo y 15 de gas.",
      efecto: { gasMax: 8, gas: 15 },
    },
    {
      key: "cabeza",
      etiqueta: "Ver tus propios videos",
      detalle: "+1 de Técnica.",
      efecto: { tecnica: 1 },
    },
  ];

  if (corrida.lesiones.length) {
    opciones.unshift({
      key: "fisio",
      etiqueta: "Fisioterapia",
      detalle: `Curas ${LESIONES[corrida.lesiones[0]].name.toLowerCase()} y recuperas 20 de gas.`,
      efecto: { quitarLesion: true, gas: 20 },
    });
  }

  return opciones;
}

// ============================================================================
// LA PELEA
//
// Un asalto = una decisión. El rival canta lo que va a hacer, tú eliges qué
// responder, y de ahí salen tres finales posibles:
//
//   te sale         → tu efecto manda y le ganas de mano
//   no te sale      → el rival resuelve lo que había cantado
//   no le sale a nadie → scramble; si te sobreextendiste, lo pagas igual
//
// El gas que traes de la corrida es el que peleas: no se resetea entre topes.
// Por eso descansar es una decisión de verdad.
// ============================================================================

const RECUPERACION_TRAS_VICTORIA = 34;

function costoDeMovimiento(mov, mods) {
  return Math.max(3, mov.gas + (mods?.costoGas ?? 0));
}

/**
 * Lo que le cuesta a este jugador intentar un movimiento, con detalles ya
 * aplicados.
 */
export function costoGas(corrida, clave) {
  return costoDeMovimiento(MOVIMIENTOS[clave], modificadores(corrida));
}

/**
 * La intención que canta el rival: sale de sus favoritos, de lo que la
 * posición permite y de cómo está de gas.
 */
export function elegirIntencion(pelea, azar = Math.random) {
  const rival = RIVALES[pelea.rivalKey];
  const posRival = espejo(pelea.pos);
  const claves = movimientosEn(posRival, [
    ...MOVIMIENTOS_BASICOS,
    ...(rival.movimientos ?? []),
  ]);

  const valorAhora = POSICIONES[posRival].valor;

  const entradas = claves.map((clave) => {
    const mov = MOVIMIENTOS[clave];
    let peso = 1;

    if (mov.tipo === "defensa") {
      // Solo se pone a respirar cuando de verdad lo necesita.
      peso = pelea.gasRival < GAS_CRITICO ? 7 : 0.35;
      return { valor: clave, peso };
    }

    if ((rival.favoritos ?? []).includes(clave)) peso *= 4;

    const destino =
      mov.a === "tap" ? 6 : mov.a ? POSICIONES[mov.a].valor : valorAhora;
    peso *= 1 + Math.max(0, destino - valorAhora) * 0.35;

    // Sin aire no se tira a lo caro.
    if (pelea.gasRival < GAS_CRITICO && mov.gas > 10) peso *= 0.35;
    // Si te ve cansado, te ahoga.
    if (mov.drena && pelea.gasYo < 45) peso *= 1.6;

    return { valor: clave, peso };
  });

  return pesado(entradas, azar) ?? "defender";
}

/**
 * Arranca un tope. El gas es el que traes de la corrida.
 */
export function nuevaPelea(corrida, rivalKey, opciones = {}, azar = Math.random) {
  const rival = RIVALES[rivalKey];
  const bloque = opciones.bloque ?? corrida.bloque ?? 0;
  const jefe = opciones.jefe ?? Boolean(rival.jefe);
  const mods = modificadores(corrida);
  // Los rivales normales se repiten entre bloques, así que suben con el
  // bloque. Los jefes no: cada uno ya viene calibrado en su nivel.
  const escala = jefe ? 0 : bloque * 2;

  const pelea = {
    rivalKey,
    jefe,
    bloque,
    defensa: rival.defensa + escala,
    ataque: rival.ataque + escala,
    gasMaxRival: rival.gas + (jefe ? 0 : bloque * 4),
    gasRival: rival.gas + (jefe ? 0 : bloque * 4),
    gasMaxYo: gasMaximo(corrida),
    gasYo: corrida.gas,
    pos: "pie",
    puntosYo: 0,
    puntosRival: 0,
    asalto: 1,
    asaltos: jefe ? 12 : 10,
    ventajaYo: mods.ventajaInicial ? 1 : 0,
    ventajaRival: 0,
    pasividad: 0,
    salvavidas: mods.segundaVida,
    intencion: null,
    registro: [],
    final: null,
  };

  pelea.intencion = elegirIntencion(pelea, azar);
  return pelea;
}

/**
 * Probabilidad real de que te salga un movimiento, ya con atributos, lectura
 * de la intención rival, ventaja, detalles, lesiones y falta de aire.
 */
export function probabilidadJugador(pelea, corrida, clave) {
  const mov = MOVIMIENTOS[clave];
  if (!mov) return 0;

  const mods = modificadores(corrida);
  const tipoRival = MOVIMIENTOS[pelea.intencion]?.tipo;
  const valorPos = POSICIONES[pelea.pos].valor;

  let p = mov.base;
  p += (corrida.atributos[mov.attr] ?? 0) * 4;
  p += mods.bonoTipo[mov.tipo] ?? 0;
  if (valorPos > 0) p += mods.bonoArriba;
  if (valorPos < 0) p += mods.bonoAbajo;

  if (mov.tipo === "defensa") p += BONO_DEFENSA;
  else if (venceA(mov.tipo, tipoRival)) p += BONO_LECTURA;
  else if (venceA(tipoRival, mov.tipo)) p -= CASTIGO_LECTURA;

  if (pelea.ventajaYo) p += BONO_VENTAJA;
  p -= pelea.defensa;
  if (pelea.gasYo < GAS_CRITICO) p -= CASTIGO_SIN_AIRE;

  return limitar(Math.round(p), 5, 95);
}

/**
 * Probabilidad de que al rival le salga lo que cantó. `tipoJugador` es lo que
 * tú intentaste: si le ganabas el duelo de tipos, le cuesta más aunque hayas
 * fallado.
 */
export function probabilidadRival(pelea, corrida, tipoJugador = null) {
  const mov = MOVIMIENTOS[pelea.intencion];
  if (!mov) return 0;

  const mods = modificadores(corrida);
  let p = mov.base + pelea.ataque - defensaJugador(corrida);

  if (tipoJugador && venceA(tipoJugador, mov.tipo)) p -= 8;
  else if (tipoJugador && venceA(mov.tipo, tipoJugador)) p += 8;

  if (pelea.ventajaRival) p += BONO_VENTAJA;
  if (pelea.gasRival < GAS_CRITICO) p -= CASTIGO_SIN_AIRE;
  if (mov.tipo === "ataque") p -= mods.contraSumision;

  return limitar(Math.round(p), 5, 95);
}

/**
 * Lo que puedes intentar este asalto, con su probabilidad y su costo. Es lo
 * único que necesita la UI para pintar los botones.
 */
export function opcionesDeAsalto(pelea, corrida) {
  const mods = modificadores(corrida);

  return movimientosEn(pelea.pos, corrida.movimientos).map((clave) => {
    const mov = MOVIMIENTOS[clave];
    const costo = costoDeMovimiento(mov, mods);
    const tipoRival = MOVIMIENTOS[pelea.intencion]?.tipo;

    return {
      clave,
      mov,
      costo,
      caro: costo > pelea.gasYo,
      chance: probabilidadJugador(pelea, corrida, clave),
      // Para pintar el triángulo: si esta respuesta le gana a lo que cantó.
      lectura:
        mov.tipo === "defensa"
          ? "aguanta"
          : venceA(mov.tipo, tipoRival)
            ? "gana"
            : venceA(tipoRival, mov.tipo)
              ? "pierde"
              : "neutro",
    };
  });
}

function cerrarPorDecision(p) {
  if (p.puntosYo > p.puntosRival) {
    return {
      resultado: "victoria",
      motivo: "puntos",
      titulo: "Ganaste por puntos",
      texto: `Sonó el silbato ${p.puntosYo}–${p.puntosRival}. Feo, pero cuenta.`,
    };
  }
  if (p.puntosRival > p.puntosYo) {
    return {
      resultado: "derrota",
      motivo: "puntos",
      titulo: "Perdiste por puntos",
      texto: `Se acabó el tiempo ${p.puntosYo}–${p.puntosRival}. No alcanzó.`,
    };
  }

  const valor = POSICIONES[p.pos].valor;
  if (valor > 0) {
    return {
      resultado: "victoria",
      motivo: "ventaja",
      titulo: "Ganaste por ventaja",
      texto: "Empatados en puntos, pero el silbato te agarró arriba.",
    };
  }
  return {
    resultado: "derrota",
    motivo: valor < 0 ? "ventaja" : "empate",
    titulo: valor < 0 ? "Perdiste por ventaja" : "Empate",
    texto:
      valor < 0
        ? "Empatados en puntos, pero el silbato te agarró abajo."
        : "Diez minutos sin que pasara nada. Aquí el que no gana, no pasa.",
  };
}

/**
 * Un asalto completo. Devuelve una pelea nueva: nunca muta la que recibe.
 */
export function resolverAsalto(pelea, corrida, clave, azar = Math.random) {
  if (pelea.final) return pelea;

  const mods = modificadores(corrida);
  const mov = MOVIMIENTOS[clave];
  const intencion = MOVIMIENTOS[pelea.intencion];
  const p = { ...pelea, registro: [...pelea.registro] };
  const asalto = pelea.asalto;
  const linea = (tono, texto) => p.registro.push({ tono, texto, asalto });

  const costo = costoDeMovimiento(mov, mods);
  p.gasYo -= costo;
  p.pasividad = mov.tipo === "defensa" ? (p.pasividad ?? 0) + 1 : 0;

  const chance = probabilidadJugador(pelea, corrida, clave);
  const salio = azar() * 100 < chance;
  p.ventajaYo = 0;

  if (salio) {
    linea("bien", `${mov.name}: te sale.`);
    p.gasRival -= 3;

    if (mov.recupera) {
      p.gasYo = Math.min(p.gasYo + mov.recupera, p.gasMaxYo);
    }
    if (mov.drena) {
      p.gasRival -= mov.drena + mods.drena;
      linea("bien", `Le sacas el aire (−${mov.drena + mods.drena} de gas).`);
    }
    if (mov.puntos) {
      p.puntosYo += mov.puntos;
      linea("bien", `+${mov.puntos} puntos.`);
    }
    if (mov.a === "tap") {
      p.final = {
        resultado: "victoria",
        motivo: "sumision",
        titulo: "Lo finalizaste",
        texto: `${mov.name} limpia. Tap en el asalto ${asalto}.`,
      };
    } else if (mov.a) {
      p.pos = mov.a;
      linea("neutro", `Ahora: ${POSICIONES[p.pos].name}.`);
    }
    if (mov.ventaja) {
      p.ventajaYo = 1;
      linea("bien", "Quedas con el agarre puesto: ventaja para el próximo.");
    }
    p.ventajaRival = 0;
    if (mov.tipo !== "defensa" && intencion) {
      linea("neutro", `Le ganaste de mano: ${intencion.name} se quedó a medias.`);
    }
  } else {
    linea("mal", `${mov.name}: no te sale.`);
    p.gasRival -= costoDeMovimiento(intencion, null);

    const chanceRival = probabilidadRival(pelea, corrida, mov.tipo);
    const salioRival = azar() * 100 < chanceRival;

    if (salioRival) {
      linea("mal", `${intencion.name}: te la mete.`);
      p.ventajaRival = 0;

      if (intencion.recupera) {
        p.gasRival = Math.min(p.gasRival + intencion.recupera, p.gasMaxRival);
      }
      if (intencion.drena) {
        p.gasYo -= intencion.drena;
        linea("mal", `Te saca el aire (−${intencion.drena} de gas).`);
      }
      if (intencion.puntos) {
        p.puntosRival += intencion.puntos;
        linea("mal", `Le dan ${intencion.puntos} puntos.`);
      }
      if (intencion.a === "tap") {
        if (p.salvavidas) {
          p.salvavidas = false;
          p.gasYo -= 6;
          p.gasRival -= 8;
          linea("aviso", "SALIDA DE EMERGENCIA: sacaste el brazo de milagro.");
        } else {
          p.final = {
            resultado: "derrota",
            motivo: "sumision",
            titulo: "Tapeaste",
            texto: `${intencion.name} y no había salida. Asalto ${asalto}.`,
          };
        }
      } else if (intencion.a) {
        p.pos = espejo(intencion.a);
        linea("mal", `Ahora: ${POSICIONES[p.pos].name}.`);
      }
      if (intencion.ventaja) p.ventajaRival = 1;
    } else {
      linea("neutro", "Scramble: los dos se quedan con las ganas.");
      p.gasYo -= 3;
      p.gasRival -= 3;
      p.ventajaRival = 0;
      if (mov.falla) {
        p.pos = mov.falla;
        linea("mal", `Te sobreextendiste. Ahora: ${POSICIONES[p.pos].name}.`);
      }
    }
  }

  // ---- Cierre del asalto ---------------------------------------------------
  if (!p.final) {
    // Quien primero se quedó sin nada. Si el movimiento salió, la lectura va
    // a favor del jugador; si falló, en contra.
    const sinGasRival = p.gasRival <= 0;
    const sinGasYo = p.gasYo <= 0;

    if (salio && sinGasRival) {
      p.final = {
        resultado: "victoria",
        motivo: "gas",
        titulo: "Se quedó sin gas",
        texto: "Levantó la mano solo. El cansancio también finaliza.",
      };
    } else if (sinGasYo) {
      p.final = {
        resultado: "derrota",
        motivo: "gas",
        titulo: "Te quedaste sin gas",
        texto: "No te quedó nada. Tapeaste de cansancio.",
      };
    } else if (sinGasRival) {
      p.final = {
        resultado: "victoria",
        motivo: "gas",
        titulo: "Se quedó sin gas",
        texto: "Levantó la mano solo. El cansancio también finaliza.",
      };
    }
  }

  p.gasYo = limitar(p.gasYo, 0, p.gasMaxYo);
  p.gasRival = limitar(p.gasRival, 0, p.gasMaxRival);

  if (!p.final) {
    // Aguantar es legítimo; guindarse de la defensa, no. Desde la segunda
    // defensa seguida el árbitro cobra, como en cualquier competencia: un
    // punto por asalto pasado. Así respirar sirve para sobrevivir un mal
    // momento, pero no para ganar la pelea sin hacer nada.
    if (p.pasividad === 2) {
      p.ventajaRival = 1;
      linea("aviso", "El profesor te avisa por pasividad: ventaja para él.");
    } else if (p.pasividad > 2) {
      p.ventajaRival = 1;
      p.puntosRival += 1;
      linea("aviso", "Sigues sin hacer nada: punto para él.");
    }

    p.asalto = asalto + 1;
    if (p.asalto > p.asaltos) {
      p.final = cerrarPorDecision(p);
    } else {
      p.intencion = elegirIntencion(p, azar);
    }
  }

  return p;
}

/**
 * El botín de un tope ganado: dos o tres opciones, se escoge una. El jefe
 * paga mejor y además te cura.
 */
export function ofertaDeBotin(corrida, pelea, azar = Math.random) {
  const jefe = pelea?.jefe;
  const tecnicas = Object.keys(MOVIMIENTOS).filter(
    (key) => !corrida.movimientos.includes(key)
  );
  const detallesLibres = Object.keys(DETALLES).filter(
    (key) => !corrida.detalles.includes(key)
  );

  const opciones = [];

  if (tecnicas.length) {
    const key = tomar(tecnicas, azar);
    opciones.push({
      key: `mov-${key}`,
      etiqueta: MOVIMIENTOS[key].name,
      kicker: "Técnica",
      detalle: MOVIMIENTOS[key].desc,
      efecto: { movimiento: key },
    });
  }

  if (detallesLibres.length) {
    const key = tomar(detallesLibres, azar);
    opciones.push({
      key: `det-${key}`,
      etiqueta: DETALLES[key].name,
      kicker: "Detalle",
      detalle: DETALLES[key].desc,
      efecto: { detalle: key },
    });
  }

  const attr = tomar(CLAVES_ATRIBUTO, azar);
  opciones.push({
    key: `attr-${attr}`,
    kicker: "Atributo",
    etiqueta: `+1 de ${ATRIBUTOS[attr].label}`,
    detalle: jefe
      ? "Lo que te dejó pelear con alguien mejor que tú."
      : "Un punto más en lo tuyo.",
    efecto: { [attr]: 1, gas: jefe ? 25 : 12 },
  });

  if (jefe) {
    opciones.push({
      key: "jefe-cura",
      kicker: "Cuerpo",
      etiqueta: "Parar dos semanas",
      detalle: "Curas todas las lesiones y llenas el tanque.",
      efecto: { curarTodo: true, gas: 999 },
    });
  }

  return opciones;
}

/**
 * Cierra el tope y devuelve la corrida con las consecuencias puestas.
 * Ganar paga botín; perder cuesta una marca, una lesión y casi todo el gas.
 */
export function cerrarPelea(corrida, pelea, azar = Math.random) {
  const mods = modificadores(corrida);
  const techo = gasMaximo(corrida);
  let nueva = {
    ...corrida,
    peleas: (corrida.peleas ?? 0) + 1,
    gas: limitar(pelea.gasYo, 0, techo),
  };
  const mensajes = [];

  if (pelea.final?.resultado === "victoria") {
    nueva.victorias = (nueva.victorias ?? 0) + 1;
    if (pelea.final.motivo === "sumision") {
      nueva.sumisiones = (nueva.sumisiones ?? 0) + 1;
    }
    nueva.gas = limitar(
      nueva.gas + RECUPERACION_TRAS_VICTORIA + mods.recuperaTrasPelea,
      0,
      techo
    );
    return { corrida: nueva, mensajes, botin: ofertaDeBotin(nueva, pelea, azar) };
  }

  // Derrota: el cuerpo lo paga.
  nueva.marcas = (nueva.marcas ?? 0) + 1;
  nueva.gas = Math.max(20, Math.round(techo * 0.45));

  const conLesion = aplicarEfecto(nueva, { lesion: "azar" }, azar);
  nueva = conLesion.corrida;
  mensajes.push(...conLesion.mensajes);

  if (pelea.jefe) {
    nueva.fin = {
      resultado: "derrota",
      titulo: "No pasaste el examen",
      texto: `${RIVALES[pelea.rivalKey].name} te cerró la puerta. Se vuelve a empezar.`,
    };
  } else if (nueva.marcas >= MARCAS_MAXIMAS) {
    nueva.fin = {
      resultado: "derrota",
      titulo: "El gym te quebró",
      texto: `${MARCAS_MAXIMAS} topes perdidos y el cuerpo no da para más. Otra corrida será.`,
    };
  }

  return { corrida: nueva, mensajes, botin: null };
}
