import BotonComprar from "@/components/demo/BotonComprar";
import config from "@/config";

/**
 * El corte del catálogo.
 *
 * Los primeros productos se ven nítidos; a partir de ahí el resto se difumina y
 * encima aparece la oferta. Lo difuminado sigue en el HTML a propósito —se ve
 * que hay más tienda detrás— pero no se puede leer ni pulsar: `select-none` y
 * `pointer-events-none` lo dejan como decorado, y `aria-hidden` lo saca del
 * lector de pantalla para no leer productos ilegibles.
 */
export default function MuroDemo({ ocultos, children }) {
  return (
    <div className="relative mt-3">
      {/* El alto está recortado a propósito: se asoma lo justo para que se vea
          que la tienda sigue, sin dejar medio metro de negro debajo. */}
      <div
        className="pointer-events-none max-h-104 select-none overflow-hidden blur-[7px] saturate-50 opacity-45"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Degradado que funde lo difuminado con el fondo de la página. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-linear-to-b from-transparent via-base-100/75 to-base-100"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-6 flex justify-center px-4">
        <div className="ficha w-full max-w-md p-7 text-center">
          <p className="rotulo">Hasta aquí llega la demo</p>

          <p className="display mt-4 text-2xl">
            <span className="cifra text-primary">+{ocultos}</span> productos más
          </p>

          <p className="mt-3 text-sm leading-relaxed text-base-content/60">
            La tienda completa lleva el catálogo entero, el panel para
            administrarlo y el importador que lo actualiza desde tu PDF.
          </p>

          <p className="cifra mt-5 text-3xl font-bold text-primary">{config.demo.precio}</p>
          <p className="mt-1 text-xs text-base-content/45">{config.demo.precioNota}</p>

          <BotonComprar className="btn btn-primary mt-5 w-full" />
        </div>
      </div>
    </div>
  );
}
