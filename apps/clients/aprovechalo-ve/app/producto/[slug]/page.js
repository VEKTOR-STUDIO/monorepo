import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BloqueVenta from "@/components/demo/BloqueVenta";
import Precios from "@/components/Precios";
import { ElegirYAgregar } from "@/components/BotonAgregar";
import FichaProducto from "@/components/FichaProducto";
import RejillaProductos from "@/components/RejillaProductos";
import Revelar from "@/components/Revelar";
import { leerProducto, leerRelacionados, leerTasa, leerCatalogo } from "@/libs/catalogo";
import { ESTADOS, enDolares } from "@/libs/formato";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const revalidate = 1800;

// Se pregeneran las fichas de la última lista importada; si llega un producto
// nuevo por Supabase, se genera en la primera visita.
export async function generateStaticParams() {
  const { productos } = await leerCatalogo();
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const producto = await leerProducto(slug);
  if (!producto) return getSEOTags({ title: "Producto no encontrado · Hardcore" });

  const precio = producto.precioContado ?? producto.precioBcv;

  return getSEOTags({
    title: `${producto.nombre} · Hardcore`,
    description: `${producto.nombre}${producto.marca ? ` de ${producto.marca}` : ""}. ${
      precio ? `Desde ${enDolares(precio)} de contado. ` : ""
    }${producto.categoria} en Hardcore, Caracas.`,
    canonicalUrlRelative: `/producto/${producto.slug}`,
    openGraph: producto.imagen
      ? { images: [{ url: producto.imagen }] }
      : undefined,
  });
}

export default async function Producto({ params }) {
  const { slug } = await params;
  const producto = await leerProducto(slug);
  if (!producto) notFound();

  const [tasa, relacionados] = await Promise.all([leerTasa(), leerRelacionados(producto)]);
  const estado = ESTADOS[producto.estado] || ESTADOS.disponible;

  // Las fotos del catálogo miden unos 90×126 px. Se enseñan al doble: más
  // grandes se deshacen, y el marco se queda pequeño a propósito en vez de
  // estirar una imagen que no da para más.
  const ancho = Math.round((producto.imagenAncho || 94) * 2.1);
  const alto = Math.round((producto.imagenAlto || 126) * 2.1);

  // Datos estructurados: que Google entienda que esto es un producto con precio.
  const esquema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    category: producto.categoria,
    ...(producto.marca && { brand: { "@type": "Brand", name: producto.marca } }),
    ...(producto.imagen && { image: `${config.siteUrl}${producto.imagen}` }),
    offers: {
      "@type": "Offer",
      price: producto.precioContado ?? producto.precioBcv ?? undefined,
      priceCurrency: "USD",
      availability:
        producto.estado === "disponible"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      url: `${config.siteUrl}/producto/${producto.slug}`,
    },
  };

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(esquema) }}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-base-content/45" aria-label="Migas">
          <Link href="/" className="transition-colors hover:text-primary">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/tienda" className="transition-colors hover:text-primary">
            Tienda
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/tienda?categoria=${producto.categoriaSlug}`}
            className="transition-colors hover:text-primary"
          >
            {producto.categoria}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            {/* El marco de la foto no es de cristal: tiene que ser blanco
                opaco para que el fondo del JPEG se funda con él. Se le deja
                solo el filo y la sombra, para que case con el resto. */}
            <div className="foto-producto relative mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-2xl p-10 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)] ring-1 ring-black/10">
              {producto.imagen ? (
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={ancho}
                  height={alto}
                  sizes="260px"
                  className="object-contain"
                  style={{ width: `${ancho}px`, height: "auto" }}
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl text-base-300">
                  <span aria-hidden="true">📦</span>
                </div>
              )}

              {producto.ofertaFlash && (
                <span className="absolute left-4 top-4 rounded-md bg-primary px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-content shadow-lg">
                  Oferta flash
                </span>
              )}
            </div>

            <p className="mt-3 text-center text-[0.7rem] text-base-content/35">
              Imagen referencial tomada de la lista de Hardcore.
            </p>
          </div>

          <div>
            <p className="rotulo">{producto.categoria}</p>

            <h1 className="display mt-3 text-3xl leading-tight sm:text-4xl">{producto.nombre}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              {producto.marca && (
                <Link
                  href={`/tienda?marca=${encodeURIComponent(producto.marca)}`}
                  className="text-base-content/60 underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  {producto.marca}
                </Link>
              )}
              <span className={`flex items-center gap-1.5 ${estado.clase}`}>
                <span className={`inline-block size-1.5 rounded-full ${estado.punto}`} aria-hidden="true" />
                {estado.texto}
              </span>
            </div>

            {producto.estado === "transito" && (
              <p className="mt-4 rounded-lg border border-warning/30 bg-warning/8 px-3.5 py-2.5 text-xs text-warning">
                En tránsito: se puede reservar, pero todavía no está en tienda. Te confirmamos la
                fecha por WhatsApp.
              </p>
            )}

            <div className="mt-8">
              <Precios producto={producto} tasa={tasa} />
            </div>

            <div className="mt-8">
              <ElegirYAgregar producto={producto} />
            </div>

            <div className="mt-8 space-y-2.5 border-t border-base-content/10 pt-6 text-sm text-base-content/55">
              <p className="flex gap-2.5">
                <span className="text-primary" aria-hidden="true">·</span>
                Retiro en {config.business.direccion}, {config.business.ciudad}.
              </p>
              <p className="flex gap-2.5">
                <span className="text-primary" aria-hidden="true">·</span>
                Delivery en Caracas y envío nacional por encomienda, a coordinar.
              </p>
              <p className="flex gap-2.5">
                <span className="text-primary" aria-hidden="true">·</span>
                ¿Dudas con este producto?{" "}
                <a
                  href={`https://wa.me/${config.business.whatsapp}?text=${encodeURIComponent(
                    `Hola Hardcore, quiero preguntar por: ${producto.nombre}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Pregúntanos por WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-24">
            <Revelar>
              <p className="rotulo">También de {producto.categoria}</p>
              <h2 className="display mt-3 text-2xl sm:text-3xl">SIGUE MIRANDO</h2>
            </Revelar>

            <RejillaProductos className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
              {relacionados.map((otro) => (
                <FichaProducto key={otro.slug} producto={otro} />
              ))}
            </RejillaProductos>
          </section>
        )}
      </main>

      <BloqueVenta />
      <Footer />
    </>
  );
}
