// Placeholder data for the upcoming card. Reemplazar con la cartelera real
// (peleadores confirmados, récords, fotos) cuando estén disponibles.

const UNSPLASH = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

export const mainEvent = {
  weightClass: "Peso Ligero",
  titleFight: true,
  red: {
    name: "Carlos Rivero",
    nickname: "El Demoledor",
    record: "12-3-0",
    weightClass: "Peso Ligero",
    country: "VE",
    countryName: "Venezuela",
    hometown: "Caracas",
    photo: UNSPLASH("photo-1583473848882-f9a5bc7fd2ee"),
  },
  blue: {
    name: "Andrés Vargas",
    nickname: "Tormenta",
    record: "10-4-1",
    weightClass: "Peso Ligero",
    country: "VE",
    countryName: "Venezuela",
    hometown: "Maracaibo",
    photo: UNSPLASH("photo-1517438476312-10d79c077509"),
  },
};

export const undercard = [
  {
    weightClass: "Peso Pluma",
    red: {
      name: "Luis Méndez",
      nickname: "Toro",
      record: "8-2-0",
      country: "VE",
      hometown: "Valencia",
      photo: UNSPLASH("photo-1571019614242-c5c5dee9f50b"),
    },
    blue: {
      name: "Jorge Ramos",
      nickname: "Tigre",
      record: "7-3-0",
      country: "VE",
      hometown: "Caracas",
      photo: UNSPLASH("photo-1518611012118-696072aa579a"),
    },
  },
  {
    weightClass: "Peso Mediano",
    red: {
      name: "Roberto Silva",
      nickname: "Acero",
      record: "9-1-0",
      country: "VE",
      hometown: "Barquisimeto",
      photo: UNSPLASH("photo-1547347298-4074fc3086f0"),
    },
    blue: {
      name: "Diego Castillo",
      nickname: "Furia",
      record: "11-5-0",
      country: "VE",
      hometown: "Maracay",
      photo: UNSPLASH("photo-1601758124277-f0086d5ab050"),
    },
  },
  {
    weightClass: "Peso Gallo",
    red: {
      name: "Hugo Pérez",
      nickname: "Relámpago",
      record: "6-1-1",
      country: "VE",
      hometown: "Caracas",
      photo: UNSPLASH("photo-1532635241-17e820acc59f"),
    },
    blue: {
      name: "Iván Torres",
      nickname: "Hierro",
      record: "5-2-0",
      country: "VE",
      hometown: "Ciudad Bolívar",
      photo: UNSPLASH("photo-1599058917212-d750089bc07e"),
    },
  },
  {
    weightClass: "Peso Welter",
    red: {
      name: "Manuel Ortega",
      nickname: "Veneno",
      record: "7-0-0",
      country: "VE",
      hometown: "Caracas",
      photo: UNSPLASH("photo-1577897966608-2c40ca8d5e95"),
    },
    blue: {
      name: "Pablo Núñez",
      nickname: "Espartano",
      record: "9-2-1",
      country: "VE",
      hometown: "Mérida",
      photo: UNSPLASH("photo-1571902943202-507ec2618e8f"),
    },
  },
];

export const roster = [
  mainEvent.red,
  mainEvent.blue,
  ...undercard.flatMap((f) => [f.red, f.blue]),
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
];
