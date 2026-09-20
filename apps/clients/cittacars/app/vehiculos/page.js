import { Suspense } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FiltrosVehiculos from "@/components/FiltrosVehiculos";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import MuroDemo from "@/components/demo/MuroDemo";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { leerVehiculos, facetasDe, filtrar } from "@/libs/vehiculos";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const revalidate = 1800;

export const metadata = getSEOTags({
  title: `Inventario de vehículos | ${config.appName}`,
  description:
    "Camionetas, pick-up y carros en venta en el showroom de Citta Cars. Filtra por tipo, marca y precio; cada vehículo con su ficha completa.",
  canonicalUrlRelative: "/vehiculos",
});

export default async function Vehiculos({ searchParams }) {
  const params = await searchParams;
  const todos = leerVehiculos();
  const facetas = facetasDe(todos);

  const lista = filtrar(todos, {
    tipo: params?.tipo,
    marca: params?.marca,
    precioMax: params?.precioMax,
    anioMin: params?.anioMin,
    q: params?.q,
    orden: params?.orden,
  });

  // En demo, el listado se parte: unos cuantos nítidos y el resto tras el muro.
  const demo = esDemo();
  const tope = config.demo.elementosVisibles;
  const visibles = demo ? lista.slice(0, tope) : lista;
  const tapados = demo ? lista.slice(tope) : [];

  return (
    <>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-base-content/10 bg-base-200 px-4 py-16 sm:px-6">
          <Image
            src="/landing/cabecera-inv.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          {/* La foto es clara; sin este velo el titular blanco no se lee. */}
          <div className="absolute inset-0 bg-base-100/70" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <span className="banda" aria-hidden="true" />
            <h1 className="display mt-5 text-4xl sm:text-5xl">Inventario</h1>
            <p className="mt-3 max-w-xl text-base-content/70">
              Todo lo que hay en el showroom ahora mismo. Cada vehículo con su año,
              kilometraje, motor, accesorios y estado de documentos.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="h-28" />}>
              <FiltrosVehiculos
                facetas={facetas}
                total={todos.length}
                mostrados={lista.length}
              />
            </Suspense>

            {lista.length === 0 ? (
              <div className="panel mt-10 p-14 text-center">
                <p className="display text-xl">Nada con esos filtros</p>
                <p className="mt-3 text-sm text-base-content/55">
                  Prueba a quitar alguno; el inventario cambia cada semana. Y si
                  buscas algo que no está, se consigue.
                </p>
              </div>
            ) : (
              <>
                <RejillaVehiculos vehiculos={visibles} className="mt-10" />

                {tapados.length > 0 && (
                  <MuroDemo ocultos={tapados.length}>
                    <RejillaVehiculos vehiculos={tapados} />
                  </MuroDemo>
                )}
              </>
            )}
          </div>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}
