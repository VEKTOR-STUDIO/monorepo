import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Alas from "@/components/Alas";
import TituloAnimado from "@/components/TituloAnimado";
import Revelar from "@/components/Revelar";
import FiltrosVehiculos from "@/components/FiltrosVehiculos";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import { AvisoMuestra } from "@/components/FotoVehiculo";
import MuroDemo from "@/components/demo/MuroDemo";
import BloqueVenta from "@/components/demo/BloqueVenta";
import { leerVehiculos, facetasDe, filtrar, hayMuestras } from "@/libs/vehiculos";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const revalidate = 1800;

export const metadata = getSEOTags({
  title: `Inventario de vehículos | ${config.appName}`,
  description:
    "Vehículos importados de Dubái, Europa, China y Estados Unidos, en showroom o a pedido. Filtra por procedencia, entrega, sede, marca y precio; cada unidad con su ficha completa.",
  canonicalUrlRelative: "/vehiculos",
});

export default async function Vehiculos({ searchParams }) {
  const params = await searchParams;
  const todos = leerVehiculos();
  const facetas = facetasDe(todos);

  const lista = filtrar(todos, {
    entrega: params?.entrega,
    origen: params?.origen,
    condicion: params?.condicion,
    sede: params?.sede,
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
        <section className="relative overflow-hidden border-b border-base-content/8 px-4 py-20 sm:px-6">
          <Alas variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="banda" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-5xl sm:text-6xl lg:text-7xl">
              El inventario
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-5 max-w-xl leading-relaxed text-base-content/60">
                Lo que está hoy en el showroom y lo que se trae por encargo, junto. Cada
                unidad dice de dónde viene, en qué sede está y en qué condición, antes de
                que tengas que escribir para preguntarlo.
              </p>
            </Revelar>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<div className="h-40" />}>
              <FiltrosVehiculos
                facetas={facetas}
                total={todos.length}
                mostrados={lista.length}
              />
            </Suspense>

            {lista.length === 0 ? (
              <div className="panel mt-10 p-14 text-center">
                <p className="display text-2xl">Nada con esos filtros</p>
                <p className="mt-3 text-sm text-base-content/55">
                  Prueba a quitar alguno. Y si buscas algo que no está, se encarga: casi
                  todo este inventario entró así.
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

            {hayMuestras() && (
              <div className="mt-12 flex justify-center">
                <AvisoMuestra />
              </div>
            )}
          </div>
        </section>

        <BloqueVenta />
      </main>

      <Footer />
    </>
  );
}
