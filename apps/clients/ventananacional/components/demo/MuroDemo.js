import BotonComprar from "@/components/demo/BotonComprar";
import Contador from "@/components/demo/Contador";
import config from "@/config";

/**
 * El corte del inventario.
 *
 * Los primeros vehículos se ven nítidos; a partir de ahí el resto se difumina y
 * encima aparece la oferta. Lo difuminado sigue en el HTML a propósito —se ve
 * que hay más inventario detrás— pero no se puede leer ni pulsar: `select-none`
 * y `pointer-events-none` lo dejan como decorado, y `aria-hidden` lo saca del
 * lector de pantalla para no leer fichas ilegibles.
 */
export default function MuroDemo({ ocultos, children }) {
  return (
    <div className="relative mt-5">
      {/* El alto está recortado a propósito: se asoma lo justo para que se vea
          que el inventario sigue, sin dejar medio metro de gris debajo. */}
      <div
        className="pointer-events-none max-h-104 select-none overflow-hidden blur-[7px] saturate-50 opacity-45"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Degradado que funde lo difuminado con el fondo de la página. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-linear-to-b from-transparent via-base-100/80 to-base-100"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-6 flex justify-center px-4">
        <div className="vidrio vidrio-denso resplandor w-full max-w-md p-7 text-center">
          <p className="microgramma text-[0.65rem] text-primary">Hasta aquí llega la demo</p>

          <p className="display mt-4 text-2xl">
            <span className="cifra text-primary">+{ocultos}</span>{" "}
            {ocultos === 1 ? "vehículo más" : "vehículos más"}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-base-content/60">
            La página completa lleva todo el inventario de las dos salas, la
            ficha de cada vehículo y el botón de WhatsApp que llega con el
            modelo ya escrito.
          </p>

          <p className="mt-5 flex items-baseline justify-center gap-2.5">
            {config.demo.precioAnterior && (
              <span className="cifra text-lg text-base-content/35 line-through">
                {config.demo.precioAnterior}
              </span>
            )}
            <span className="cifra text-3xl font-bold text-primary">{config.demo.precio}</span>
          </p>
          <p className="mt-1 text-xs text-base-content/45">{config.demo.precioNota}</p>

          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="microgramma text-[0.6rem] text-base-content/45">
              Este precio termina en
            </p>
            <Contador formato="completo" />
          </div>

          <BotonComprar className="btn btn-primary mt-5 w-full" />
        </div>
      </div>
    </div>
  );
}
