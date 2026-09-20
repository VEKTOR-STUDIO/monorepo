// -----------------------------------------------------------------------------
// El logotipo de Aprovéchalo.
//
// Es tipográfico y propio: la palabra en mayúsculas muy apretadas con la banda
// diagonal de tres franjas al lado. No hay archivo de imagen que mantener y
// escala a cualquier tamaño sin pesar nada.
//
// La cuenta de Instagram no tiene un logotipo suyo que se pueda usar —la foto
// de perfil es una fotografía—, así que esto hace de marca hasta que exista
// uno de verdad.
// -----------------------------------------------------------------------------

/**
 * @param {"claro"|"oscuro"} tono  sobre fondo blanco o sobre fondo oscuro
 */
export default function Logo({ className = "", tono = "claro", conBanda = true }) {
  const color = tono === "oscuro" ? "text-base-100" : "text-base-content";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {conBanda && <span className="banda w-7 shrink-0" aria-hidden="true" />}
      <span className={`display text-[1.05rem] leading-none ${color}`}>
        Aprovéchalo
      </span>
    </span>
  );
}

/** La versión grande y centrada de la puerta de acceso. */
export function LogoGrande({ className = "", tono = "oscuro" }) {
  const color = tono === "oscuro" ? "text-base-100" : "text-base-content";

  return (
    <span className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <span className={`display text-4xl leading-none sm:text-5xl ${color}`}>
        Aprovéchalo
      </span>
      <span className="banda banda-ancha max-w-44" aria-hidden="true" />
    </span>
  );
}
