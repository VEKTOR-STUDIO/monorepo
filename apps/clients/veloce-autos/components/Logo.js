import MarcaVeloce from "@/components/MarcaVeloce";

// -----------------------------------------------------------------------------
// La marca de Veloce Autos.
//
// Todo sale de components/MarcaVeloce.js, que es el trazado exacto de su foto
// de perfil. Aquí solo se monta de las tres maneras en que hace falta:
//
//   <Logo />         la V y el nombre en línea. Cabecera y pie.
//   <LogoGrande />   la V encima del nombre, como su comunicado. Portadas.
//   <LogoChapa />    la V negra dentro del círculo blanco, como su avatar.
//
// No hay ningún PNG detrás. El original —public de Instagram, 1080 px— está
// guardado en docs/fuentes/ como material de partida, pero la página no lo
// sirve: lo que se pinta es vector, así que la chapa de 28 px de la cabecera y
// la V de 600 px de una portada salen del mismo dibujo.
//
// El color siempre es `currentColor`. Sobre el negro de la página la marca es
// blanca; dentro de la chapa, el círculo es blanco y la V hereda el negro. Un
// solo dibujo, ningún archivo por variante.
// -----------------------------------------------------------------------------

/**
 * El avatar: la V negra en un círculo blanco, igual que su foto de perfil.
 *
 * `lado` admite un número de píxeles o cualquier medida CSS —la puerta le pasa
 * un `clamp()` para que encoja con el alto de la pantalla—.
 */
export function LogoChapa({ lado = 36, className = "" }) {
  const medida = typeof lado === "number" ? `${lado}px` : lado;
  // Por debajo de unos 22 px el hueco entre las púas y el cuerpo no cabe en un
  // píxel y la marca se empasta, así que ahí se pinta la versión sin púas.
  const diminuta = typeof lado === "number" && lado < 22;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-white ${className}`}
      style={{ width: medida, height: medida }}
      aria-hidden="true"
    >
      <MarcaVeloce compacta={diminuta} className="h-[42%] w-auto text-black" />
    </span>
  );
}

/**
 * @param {"claro"|"oscuro"} tono  sobre fondo claro o sobre fondo oscuro
 */
export default function Logo({ className = "", tono = "oscuro", alto = 26 }) {
  const color = tono === "oscuro" ? "text-base-content" : "text-base-100";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <MarcaVeloce className={`w-auto shrink-0 ${color}`} style={{ height: alto }} />
      <span className="leading-none">
        <span className={`marca block text-[1.05rem] leading-none ${color}`}>Veloce</span>
        <span className="marca mt-1 block text-[0.42rem] leading-none tracking-[0.5em] text-base-content/45">
          Autos
        </span>
      </span>
    </span>
  );
}

/** Grande y centrado, como la cabecera de su comunicado. */
export function LogoGrande({ className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <MarcaVeloce className="h-14 w-auto text-base-content sm:h-20" />
      <span className="marca mt-4 text-4xl leading-none text-base-content sm:text-5xl">
        Veloce
      </span>
      <span className="marca mt-2.5 text-[0.6rem] leading-none tracking-[0.62em] text-base-content/45">
        Autos
      </span>
    </span>
  );
}
