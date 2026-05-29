// Cartelera oficial — LEGIÓN 10 (16 de mayo de 2026, 18:30).
//
// NOTA DE CONTENIDO: los nombres de los peleadores son los reales de la
// cartelera de Legión 10. Récords, apodos, divisiones de peso y fotos NO son
// definitivos: están pendientes de los datos oficiales. La UI está construida
// para verse completa solo con los nombres, así que se puede publicar tal cual
// y enriquecer cada ficha cuando lleguen los datos reales.
//
// Para añadir foto/récord/apodo a un peleador, basta con agregar las claves
// `photo`, `record`, `nickname`, `weightClass`, `country`, `hometown`.

// ── Evento estelar ───────────────────────────────────────────────────────────
export const mainEvent = {
  bout: "Main Event",
  weightClass: "MMA",
  titleFight: false,
  red: { name: "Samuel Requena" },
  blue: { name: "John Gruesso" },
};

// ── Cartelera MMA (resto de combates, en orden de pelea) ──────────────────────
export const undercard = [
  {
    weightClass: "MMA",
    red: { name: "Eduardo Pérez" },
    blue: { name: "Kleider Sandoval" },
  },
  {
    weightClass: "MMA Femenino",
    red: { name: "Angela Maya" },
    blue: { name: "Paula Maya" },
  },
  {
    weightClass: "MMA Femenino",
    red: { name: "Daniuska González" },
    blue: { name: "Gabriela Araque" },
  },
  {
    weightClass: "MMA Femenino",
    red: { name: "Indira Acevedo" },
    blue: { name: "Sandra Díaz" },
  },
  {
    weightClass: "MMA",
    red: { name: "Gabriel Ruiz" },
    blue: { name: "George Tafek" },
  },
  {
    weightClass: "MMA",
    red: { name: "Pedro Mencia" },
    blue: { name: "Kevin Dias Junior" },
  },
  {
    weightClass: "MMA Femenino",
    red: { name: "Nazaret Puerta" },
    blue: { name: "Génesis Acuña" },
  },
  {
    weightClass: "MMA",
    red: { name: "Carlos Fernández" },
    blue: { name: "Derek López" },
  },
];

// ── Cartelera de Submission Grappling (Jiu-Jitsu, dentro del mismo evento) ────
export const grappling = [
  {
    weightClass: "Grappling",
    red: { name: "Ezequiel De Fonseca" },
    blue: { name: "Carlos Calvete" },
  },
  {
    weightClass: "Grappling",
    red: { name: "Gabriel Gótera" },
    blue: { name: "Juan Pablo Álvarez" },
  },
  {
    weightClass: "Grappling Femenino",
    red: { name: "Maleiva Medina" },
    blue: { name: "Ivana Ordaz" },
  },
];

// Roster derivado de toda la cartelera (MMA + grappling) para la sección de peleadores.
export const roster = [
  mainEvent.red,
  mainEvent.blue,
  ...undercard.flatMap((f) => [f.red, f.blue]),
  ...grappling.flatMap((f) => [f.red, f.blue]),
];

export const editions = [
  { number: "I", date: "Octubre 2021", venue: "Caracas", note: "Inauguración." },
  { number: "II", date: "Marzo 2022", venue: "Caracas", note: "Primer título disputado." },
  { number: "III", date: "Julio 2022", venue: "Caracas", note: "Coronación de Gabriel Ruiz." },
  { number: "IV", date: "Noviembre 2022", venue: "Caracas", note: "Cuatro nocauts en cartelera." },
  { number: "V", date: "Marzo 2023", venue: "Caracas", note: "Récord de asistencia." },
  { number: "VI", date: "Julio 2023", venue: "Hotel Tamanaco, Caracas", note: "Sexta edición — grappling incluido." },
  { number: "VII", date: "Octubre 2023", venue: "Maracaibo", note: "Primera fuera de Caracas." },
  { number: "VIII", date: "Marzo 2024", venue: "Caracas", note: "Rainier Noguera, nuevo campeón." },
  { number: "IX", date: "Octubre 2024", venue: "Caracas", note: "Regreso a la capital con cartelera doble." },
  {
    number: "X",
    date: "16 Mayo 2026",
    venue: "Caracas",
    note: "Doble disciplina: 9 combates de MMA y 3 de submission grappling. Estelar Samuel Requena vs John Gruesso.",
  },
];
