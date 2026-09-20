// -----------------------------------------------------------------------------
// Las cintas de texto que corren en la puerta de la demo.
//
// Solo se usan ahí: la tienda es la voz de Hardcore y esto es la voz del que
// la vende. Van en Microgramma —la tipografía de la firma— para que la
// diferencia se note antes de leer.
//
// El texto va duplicado a propósito; el porqué está en .cintillo-pista
// (app/globals.css).
// -----------------------------------------------------------------------------

const MENSAJES = {
  // La de arriba: es lo primero que se ve y tiene que dejar claro en dos
  // segundos que hay algo a la venta.
  puerta: [
    "Edición completa",
    "Acceso anticipado",
    "Precio de lanzamiento",
    "Todo incluido · sin mensualidad",
    "El código es tuyo",
    "Plazas limitadas",
  ],

  // La de abajo, girando al revés para que las dos no vayan en paralelo.
  // Todas estas salen de config.demo.incluye: son cosas que el sistema hace
  // de verdad, no adornos.
  puertaInversa: [
    "231 productos cargados",
    "Importador de PDF",
    "Panel de administración",
    "Pedidos por WhatsApp",
    "Tasa del BCV automática",
    "Dominio propio",
  ],
};

/**
 * @param {"puerta"|"puertaInversa"} variante
 * @param {boolean} invertido  gira en sentido contrario
 * @param {number} velocidad  segundos por vuelta; menos = más rápido
 */
export default function Cintillo({
  variante = "puerta",
  invertido = false,
  velocidad,
  className = "",
}) {
  const frases = MENSAJES[variante] || MENSAJES.puerta;

  // Dos vueltas de lo mismo: la segunda tapa el hueco que deja la primera al
  // desplazarse, y así la cinta no parpadea al reiniciar.
  const pista = [...frases, ...frases];

  return (
    <div
      className={`cintillo ${className}`}
      role="separator"
      aria-label="Información sobre el sistema a la venta"
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
            <span className="cintillo-punto text-primary">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
