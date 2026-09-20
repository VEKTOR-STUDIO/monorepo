// -----------------------------------------------------------------------------
// El cintillo que separa las dos voces de la página.
//
// Arriba de esta página conviven dos cosas distintas y el visitante tiene
// derecho a saber cuál está leyendo:
//
//   · el ESCAPARATE, que le habla al comprador de un carro;
//   · la OFERTA, que le habla al dueño de @aprovechalo.ve sobre el sistema
//     que se le está vendiendo.
//
// Entre una y otra pasa esta cinta, en Microgramma —la tipografía de la firma
// de Alessandrovaru— para que se lea como una voz ajena a la marca del
// cliente. No es decoración: es el aviso de que cambia el interlocutor.
//
// El texto va duplicado a propósito; el porqué está en .cintillo-pista
// (app/globals.css).
// -----------------------------------------------------------------------------

const MENSAJES = {
  venta: [
    "Esto es para ti, dueño de Aprovéchalo",
    "Así se administra por dentro",
    "Lo que sigue es la oferta",
    "Tu página, tu dominio, tu código",
  ],
  cliente: [
    "Volvemos al escaparate",
    "Lo que ve quien viene a comprar",
  ],
};

/**
 * @param {"venta"|"cliente"} variante  a quién le habla lo que viene debajo
 */
export default function Cintillo({ variante = "venta" }) {
  const frases = MENSAJES[variante] || MENSAJES.venta;

  // Dos vueltas de lo mismo: la segunda tapa el hueco que deja la primera al
  // desplazarse, y así la cinta no parpadea al reiniciar.
  const pista = [...frases, ...frases];

  return (
    <div
      className={`cintillo cintillo-${variante}`}
      role="separator"
      aria-label={
        variante === "venta"
          ? "A partir de aquí, información sobre el sistema a la venta"
          : "A partir de aquí, el escaparate de vehículos"
      }
    >
      <div className="cintillo-pista" aria-hidden="true">
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
