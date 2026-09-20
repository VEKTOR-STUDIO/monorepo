import Link from "next/link";
import { enlaceDeCompra, compraEsExterna } from "@/libs/demo";
import config from "@/config";

/**
 * El botón de "quiero esto".
 *
 * Sale en la barra, en el muro del catálogo y en el bloque de venta, así que
 * vive aquí: el día que cambie el enlace de compra se cambia en config y todos
 * los botones del sitio apuntan al sitio nuevo.
 */
export default function BotonComprar({ className = "btn btn-primary", children }) {
  const destino = enlaceDeCompra();
  const texto = children || config.demo.textoBoton;

  if (compraEsExterna()) {
    return (
      <a href={destino} target="_blank" rel="noopener noreferrer" className={className}>
        {texto}
      </a>
    );
  }

  return (
    <Link href={destino} className={className}>
      {texto}
    </Link>
  );
}
