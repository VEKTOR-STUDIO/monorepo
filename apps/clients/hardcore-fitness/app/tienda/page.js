import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarraTienda, PanelFiltros } from "@/components/FiltrosTienda";
import FichaProducto from "@/components/FichaProducto";
import { leerCatalogo, filtrar, facetasDe } from "@/libs/catalogo";
import { getSEOTags } from "@/libs/seo";
import { FAMILIAS } from "@/libs/catalogo-normalizar.mjs";

export const revalidate = 1800;

export async function generateMetadata({ searchParams }) {
  const p = await searchParams;
  const familia = FAMILIAS.find(([slug]) => slug === p?.familia);

  return getSEOTags({
    title: familia
      ? `${familia[1]} · Hardcore`
      : "Catálogo · Hardcore",
    description: familia
      ? `${familia[1]} disponibles en Hardcore, Caracas. Precio de contado, BCV y Pago Móvil.`
      : "Todo el catálogo de Hardcore: suplementación deportiva, equipo de entrenamiento, natación, bolsos y accesorios.",
    canonicalUrlRelative: "/tienda",
  });
}

export default async function Tienda({ searchParams }) {
  const p = (await searchParams) || {};
  const { productos } = await leerCatalogo();

  const filtros = {
    familia: p.familia || null,
    categoria: p.categoria || null,
    marca: p.marca || null,
    estado: p.estado || null,
    busqueda: p.q || null,
    soloOfertas: p.ofertas === "1",
    orden: p.orden || "relevancia",
  };

  const resultado = filtrar(productos, filtros);
  // Las facetas se calculan sobre todo el catálogo: si se contaran solo sobre
  // lo filtrado, al elegir una marca desaparecerían todas las demás.
  const facetas = facetasDe(productos);

  const titulo =
    FAMILIAS.find(([slug]) => slug === filtros.familia)?.[1] ||
    (filtros.soloOfertas ? "Ofertas flash" : null) ||
    (filtros.busqueda ? `Resultados para "${filtros.busqueda}"` : "Todo el catálogo");

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-xs text-base-content/45" aria-label="Migas">
          <Link href="/" className="transition-colors hover:text-primary">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-base-content/70">Tienda</span>
        </nav>

        <h1 className="display text-3xl sm:text-4xl">{titulo}</h1>

        <div className="mt-8">
          <Suspense>
            <BarraTienda facetas={facetas} total={productos.length} mostrados={resultado.length} />
          </Suspense>
        </div>

        <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10 lg:items-start">
          <Suspense>
            <PanelFiltros facetas={facetas} />
          </Suspense>

          <div>
            {resultado.length === 0 ? (
              <div className="ficha flex flex-col items-center gap-4 px-6 py-20 text-center">
                <p className="display text-2xl text-base-content/30">SIN RESULTADOS</p>
                <p className="max-w-sm text-sm text-base-content/55">
                  No hay nada con esos filtros en la lista actual. Prueba con menos filtros o
                  escríbenos y te decimos si está en camino.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href="/tienda" className="btn btn-sm btn-primary">
                    Ver todo
                  </Link>
                  <Link href="/contacto" className="btn btn-sm btn-outline">
                    Preguntar
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {resultado.map((producto, i) => (
                  <FichaProducto key={producto.slug} producto={producto} prioridad={i < 4} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
