/** Carrocerías que sabe dibujar `Silueta` cuando una unidad no tiene foto. */
export type Tipo = "suv" | "sedan" | "pickup" | "camion" | "furgon" | "moto";

/** Una unidad del inventario, reducida a lo que cabe en una tarjeta. */
export type Unidad = {
  marca: string;
  modelo: string;
  anio: number | null;
  /** En dólares, sin formato. */
  precio: number;
  tipo: Tipo;
  km?: number;
  /** Lone Star vende desde subastas de EE. UU.: allí se cuenta en millas. */
  millas?: number;
  /** DSS vende a crédito: lo que manda es la cuota, no el precio. */
  cuota?: number;
  periodo?: string;
  /** Ruta dentro de `public/`. Sin foto se pinta la silueta. */
  foto?: string;
};

export type Logo =
  /** El avatar de Instagram del cliente, recortado en círculo. */
  | { kind: "imagen"; src: string; fondo?: string }
  /** La V de Veloce, en vector (igual que en su web). */
  | { kind: "veloce" }
  /** El recuadro azul rey de Coronado Carss, en vector. */
  | { kind: "coronado" };

export type Marca = {
  /** Slug del video: compone el id de las composiciones y la carpeta de `public/`. */
  id: string;
  /** Carpeta del cliente en `apps/clients/`. Solo documentación. */
  cliente: string;
  nombre: string;
  /** Cómo se escribe en el titular de portada si difiere del nombre (saltos, abreviatura). */
  nombreCorto?: string;
  tagline: string;
  ciudad: string;
  /**
   * Dónde está publicada su demo: el alias de producción del proyecto en
   * Vercel, leído del proyecto (no compuesto a mano: a Veloce le tocó
   * `veloce-autos-nine`). Cuando compren su dominio propio, va aquí.
   */
  dominio: string;
  /** Seguidores de Instagram tal como los muestra su perfil; vacío si no hay dato. */
  seguidores?: string;

  /** La paleta de la web del cliente (sus tokens de `globals.css`, en hex). */
  colores: {
    fondo: string;
    superficie: string;
    linea: string;
    tinta: string;
    /** Tinta secundaria: textos atenuados. */
    humo: string;
    primario: string;
    /** Texto encima de `primario`. */
    sobrePrimario: string;
    acento: string;
  };
  /** Tema claro (Aprovéchalo, Top Miami): cambia sombras y velos. */
  claro?: boolean;

  /** La tipografía de titulares de su web. */
  display: {
    family: string;
    weight: number;
    italic?: boolean;
    tracking?: string;
  };

  logo: Logo;
  /** Franja de colores de la casa (bandera de Italia en Citta, la tricolor en Venta Nacional…). */
  franja?: string[];

  /** Escena 2: lo que le pasa hoy. Si falta, se arma con los seguidores. */
  problema?: { a: string; b: string };
  /** Escena 4: lo que solo tiene este negocio. */
  diferencial: { kicker: string; lineas: string[]; nota: string };
  /** Escena 3: la primera de las cuatro llamadas, si la del molde no le sirve. */
  llamadaPrecio?: string;
};
