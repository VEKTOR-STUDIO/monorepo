// -----------------------------------------------------------------------------
// El cintillo que separa las dos voces de la página.
//
// Arriba de esta página conviven dos cosas distintas y el visitante tiene
// derecho a saber cuál está leyendo:
//
//   · el ESCAPARATE, que le habla a quien viene a comprar o a vender un carro;
//   · la OFERTA, que le habla al dueño de Kings Cars sobre el sistema
//     que se le está vendiendo.
//
// Entre una y otra pasa esta cinta, en Microgramma —la tipografía de la firma
// de Vektor— para que se lea como una voz ajena a la marca del
// cliente. No es decoración: es el aviso de que cambia el interlocutor.
//
// El texto va duplicado a propósito; el porqué está en .cintillo-pista
// (app/globals.css).
// -----------------------------------------------------------------------------

const MENSAJES = {
  venta: [
    "Esto es para ti, Kings Cars",
    "Así se administra por dentro",
    "Lo que sigue es la oferta",
    "Tu página, tu dominio, tu código",
  ],
  cliente: [
    "Volvemos al escaparate",
    "Lo que ve quien viene a comprar",
  ],

  // La puerta. Aquí el tono es de lanzamiento: es lo primero que se ve y
  // tiene que dejar claro en dos segundos que hay algo a la venta.
  puerta: [
    "Edición completa",
    "Acceso anticipado",
    "Precio de lanzamiento",
    "Todo incluido · sin mensualidad",
    "El código es tuyo",
    "Hecha con tu Instagram",
  ],

  // La de abajo, girando al revés para que las dos no vayan en paralelo.
  puertaInversa: [
    "Dominio propio",
    "Inventario ilimitado",
    "Panel incluido",
    "Usados y 0 km separados",
    "Página de «publica tu vehículo gratis»",
    "Entrega en 7 días",
  ],
};

/**
 * @param {"venta"|"cliente"|"puerta"|"puertaInversa"} variante
 *   a quién le habla lo que viene debajo
 * @param {boolean} invertido  gira en sentido contrario
 * @param {number} velocidad  segundos por vuelta; menos = más rápido
 */
export default function Cintillo({
  variante = "venta",
  invertido = false,
  velocidad,
  className = "",
}) {
  const frases = MENSAJES[variante] || MENSAJES.venta;

  // Dos vueltas de lo mismo: la segunda tapa el hueco que deja la primera al
  // desplazarse, y así la cinta no parpadea al reiniciar.
  const pista = [...frases, ...frases];

  // Las dos variantes de la puerta comparten el estilo oscuro de "venta".
  const estilo = variante.startsWith("puerta") ? "venta" : variante;

  return (
    <div
      className={`cintillo cintillo-${estilo} ${className}`}
      role="separator"
      aria-label={
        estilo === "venta"
          ? "A partir de aquí, información sobre el sistema a la venta"
          : "A partir de aquí, el escaparate de vehículos"
      }
    >
      <div
        className="cintillo-pista"
        aria-hidden="true"
        style={{
          animationDirection: invertido ? "reverse" : undefined,
          animationDuration: velocidad ? `${velocidad}s` : undefined,
        }}
      >
        {pista.map((frase, i) => (
          <span key={`${frase}-${i}`} className="flex items-center gap-10">
            <span className="microgramma cintillo-texto">{frase}</span>
            <span className="cintillo-punto">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
