import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BloqueVenta from "@/components/demo/BloqueVenta";
import HeroTienda from "@/components/HeroTienda";
import CintaMarcas from "@/components/CintaMarcas";
import RejillaFamilias from "@/components/RejillaFamilias";
import ComoComprar from "@/components/ComoComprar";
import FichaProducto from "@/components/FichaProducto";
import RejillaProductos from "@/components/RejillaProductos";
import Revelar from "@/components/Revelar";
import { leerCatalogo, facetasDe, leerTasa, filtrar } from "@/libs/catalogo";

// El catálogo cambia cuando Hardcore importa una lista nueva, no a cada
// visita: se rehace la portada cada media hora.
export const revalidate = 1800;

export default async function Inicio() {
  const [{ productos }, tasa] = await Promise.all([leerCatalogo(), leerTasa()]);
  const facetas = facetasDe(productos);

  const ofertas = filtrar(productos, { soloOfertas: true, orden: "precio-asc" }).slice(0, 8);

  // Para el collage de la portada mandan los botes grandes, no las tobilleras:
  // se eligen productos de suplementación, disponibles y de precio alto, que
  // son los que enseñan de un vistazo a qué se dedica la tienda.
  const FAMILIAS_ESCAPARATE = ["proteinas", "ganadores", "creatina", "preentreno"];
  const destacados = productos
    .filter(
      (p) =>
        p.imagen && p.estado === "disponible" && FAMILIAS_ESCAPARATE.includes(p.familia)
    )
    .sort((a, b) => (b.precioContado ?? 0) - (a.precioContado ?? 0))
    .slice(0, 4);

  // Una foto por familia, para el mosaico de categorías.
  const familias = facetas.familias.map((familia) => ({
    ...familia,
    imagen: productos.find((p) => p.familia === familia.slug && p.imagen)?.imagen || null,
  }));

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main>
        <HeroTienda
          total={productos.length}
          marcas={facetas.marcas.length}
          categorias={facetas.categorias.length}
          tasa={tasa}
          destacados={destacados}
        />

        <CintaMarcas marcas={facetas.marcas.slice(0, 22).map((m) => m.nombre)} />

        {ofertas.length > 0 && (
          <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 sm:px-6">
            <div className="textura absolute inset-0" aria-hidden="true" />
            <Revelar className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="rotulo">Precio marcado</p>
                <h2 className="cromo display mt-3 text-3xl sm:text-4xl">OFERTAS FLASH</h2>
              </div>
              <Link href="/tienda?ofertas=1" className="btn btn-sm btn-outline">
                Ver todas
              </Link>
            </Revelar>

            <RejillaProductos className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {ofertas.slice(0, 4).map((producto) => (
                <FichaProducto key={producto.slug} producto={producto} />
              ))}
            </RejillaProductos>
          </section>
        )}

        <RejillaFamilias familias={familias} />

        <ComoComprar />

        <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 text-center sm:px-6">
          <div className="textura absolute inset-0" aria-hidden="true" />
          <Revelar>
            <h2 className="display text-3xl sm:text-4xl">
              ¿NO CONSIGUES
              <br />
              <span className="text-primary texto-glow">LO QUE BUSCAS?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base-content/60">
              Escríbenos y te decimos si lo tenemos en camino o cuándo llega.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/tienda" className="btn btn-primary">
                Buscar en el catálogo
              </Link>
              <Link href="/contacto" className="btn btn-outline">
                Contacto
              </Link>
            </div>
          </Revelar>
        </section>
      </main>

      <BloqueVenta />
      <Footer />
    </>
  );
}
