import Image from "next/image";
import Silueta from "@/components/Silueta";
import MarcaVeloce from "@/components/MarcaVeloce";

/**
 * El cuadro donde va la unidad.
 *
 * Con foto, la enseña recortada al cuadro. Sin foto —que hoy es el caso de
 * todo el inventario, porque las suyas siguen dentro de Instagram— dibuja la
 * silueta de la carrocería sobre el charco de luz del showroom, con la V de la
 * casa de marca de agua detrás.
 *
 * Ese fondo no es relleno. Un hueco gris con un icono de cámara dice "aquí
 * falta algo"; una silueta centrada sobre la marca dice "así se va a ver tu
 * unidad cuando subas la foto", que es lo que hay que enseñar en una demo.
 */
export default function FotoVehiculo({
  vehiculo,
  className = "",
  prioridad = false,
  encajar = "cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
}) {
  const foto = vehiculo.fotos?.[0] || null;

  return (
    <div className={`relative overflow-hidden estudio ${className}`}>
      {foto ? (
        <Image
          src={foto}
          alt={`${vehiculo.tituloLargo} ${vehiculo.anio}`}
          fill
          sizes={sizes}
          priority={prioridad}
          className={encajar === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        <>
          {/* La marca de agua, grande y al 4 %: se intuye, no se lee. */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <MarcaVeloce className="h-[62%] w-auto text-base-content/[0.045]" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-[9%]">
            <div className="relative w-full max-w-2xl">
              <Silueta tipo={vehiculo.carroceria} className="w-full text-base-content/30" />
              {/* La sombra va debajo de las ruedas, no del dibujo entero. */}
              <div className="sombra-piso absolute inset-x-[8%] bottom-[4%] h-3" aria-hidden="true" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** El cartelito de "aquí falta la foto real". */
export function AvisoSinFoto({ className = "" }) {
  return (
    <span
      className={`cifra bg-base-content/6 px-2.5 py-1 text-[0.65rem] text-base-content/45 ${className}`}
    >
      Foto pendiente
    </span>
  );
}

/**
 * "Esta unidad no es suya todavía".
 *
 * Es el aviso más importante de la demo y por eso está escrito sin rodeos. El
 * inventario real de Veloce está en @veloce.autos; mientras no se pueda traer
 * de ahí, lo que se enseña son unidades de ejemplo con precios de referencia.
 *
 * Enseñar como suyo un vehículo que el negocio no tiene es justo el detalle
 * que hunde una reunión que iba bien: basta con que pregunten "¿y esa Prado
 * dónde está?". Decirlo antes de que lo pregunten convierte el problema en
 * una muestra de cómo se va a ver lo suyo.
 *
 * Desaparece solo en cuanto la ficha deja de llevar `muestra`.
 */
export function AvisoMuestra({ className = "", corto = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-base-content/15 px-3 py-1.5 text-[0.7rem] text-base-content/55 ${className}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
      </svg>
      {corto ? "Unidad de ejemplo" : "Unidad de ejemplo: el inventario real está en su Instagram"}
    </span>
  );
}

/** La versión diminuta, para la esquina de una tarjeta de la rejilla. */
export function SelloMuestra({ className = "" }) {
  return (
    <span
      className={`cifra bg-base-100/85 px-2 py-1 text-[0.6rem] uppercase tracking-wider text-base-content/60 backdrop-blur-sm ${className}`}
    >
      Ejemplo
    </span>
  );
}
