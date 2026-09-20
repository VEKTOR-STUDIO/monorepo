import Image from "next/image";

// -----------------------------------------------------------------------------
// El logo de Hardcore.
//
// El archivo original es su foto de perfil de Instagram: un cuadrado de
// 638×638 con las letras arqueadas en rojo y mucho negro alrededor. Aquí se
// usa de dos maneras:
//
//   <Logo />          recorta las letras y las deja a la altura que se pida
//   <LogoCuadrado />  el cuadrado entero, para la pantalla de acceso
//
// El recorte no se hace con un editor: se mide y se aplica con CSS, así que
// el día que manden un logo nuevo solo hay que cambiar el archivo y, si acaso,
// estos cuatro números.
//
// Medido sobre el original: las letras ocupan x 70→579 e y 259→404.
// Se recorta con un poco de aire alrededor: x 60→590, y 249→414.
// -----------------------------------------------------------------------------

const ARCHIVO = "/marca/hardcore.jpg";

const ORIGINAL = 638;
const RECORTE = { x: 60, y: 249, ancho: 530, alto: 166 };

// Todo en proporción al ancho que se pida, para que escale sin tocar nada.
const ESCALA = ORIGINAL / RECORTE.ancho;
const PROPORCION = RECORTE.alto / RECORTE.ancho;
const DESPLAZA_X = -RECORTE.x / RECORTE.ancho;
const DESPLAZA_Y = -(RECORTE.y / ORIGINAL) * ESCALA;

/**
 * Las letras "HARDCORE", recortadas del cuadrado.
 *
 * `mix-blend-mode: screen` hace desaparecer el negro del JPEG sobre cualquier
 * fondo oscuro: no hace falta una versión con transparencia.
 *
 * @param {number} ancho  ancho en píxeles del bloque de letras
 */
export default function Logo({ ancho = 132, className = "", prioridad = false }) {
  // La imagen se pide ya al tamaño al que se va a dibujar, no a 638.
  const lado = Math.round(ancho * ESCALA);

  return (
    <span
      className={`relative block shrink-0 overflow-hidden ${className}`}
      style={{ width: ancho, height: ancho * PROPORCION }}
    >
      <Image
        src={ARCHIVO}
        alt="Hardcore"
        width={lado}
        height={lado}
        priority={prioridad}
        className="pointer-events-none absolute max-w-none mix-blend-screen"
        style={{
          width: lado,
          height: lado,
          left: ancho * DESPLAZA_X,
          top: ancho * DESPLAZA_Y,
        }}
      />
    </span>
  );
}

/** El cuadrado completo, tal cual lo usan en Instagram. */
export function LogoCuadrado({ lado = 200, className = "", prioridad = false }) {
  // `lado` admite un número de píxeles o cualquier medida CSS —la puerta le pasa
  // un `clamp()` para que el logo encoja con el alto de la pantalla—. Al
  // navegador le vale cualquiera de las dos; Next necesita un número para
  // elegir qué archivo servir, y ahí va el mayor que puede llegar a medir.
  const medida = typeof lado === "number" ? `${lado}px` : lado;
  const servir = typeof lado === "number" ? lado : 200;

  return (
    <Image
      src={ARCHIVO}
      alt="Hardcore"
      width={servir}
      height={servir}
      priority={prioridad}
      className={`block mix-blend-screen ${className}`}
      style={{ width: medida, height: medida }}
    />
  );
}
