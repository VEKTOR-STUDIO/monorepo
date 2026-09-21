import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Escenario from "@/components/Escenario";
import TituloAnimado from "@/components/TituloAnimado";
import Revelar from "@/components/Revelar";
import FiltrosVehiculos from "@/components/FiltrosVehiculos";
import RejillaVehiculos from "@/components/RejillaVehiculos";
import { AvisoPrecioProvisional, AvisoDeMuestra } from "@/components/FotoVehiculo";
import MuroDemo from "@/components/demo/MuroDemo";
import BloqueVenta from "@/components/demo/BloqueVenta";
import {
  leerVehiculos,
  facetasDe,
  filtrar,
  hayPreciosProvisionales,
  hayUnidadesDeMuestra,
} from "@/libs/vehiculos";
import { esDemo } from "@/libs/demo";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const revalidate = 1800;

export const metadata = getSEOTags({
  title: `Inventario | ${config.appName}`,
  description:
    "Carros usados en Caracas: camionetas, sedanes y pick-ups revisados. Filtra por carrocería, marca y precio; cada unidad con su ficha completa.",
  canonicalUrlRelative: "/vehiculos",
});

export default async function Vehiculos({ searchParams }) {
  const params = await searchParams;
  const todos = leerVehiculos();
  const facetas = facetasDe(todos);

  const lista = filtrar(todos, {
    condicion: params?.condicion,
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
        <section className="relative overflow-hidden border-b border-base-content/8 bg-base-200 px-4 py-20 sm:px-6">
          <Escenario variante="seccion" />
          <div className="textura absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <Revelar>
              <span className="filete" aria-hidden="true" />
            </Revelar>
            <TituloAnimado as="h1" className="display mt-6 text-4xl sm:text-5xl lg:text-6xl">
              <span className="rotulo-marca">El</span>{" "}
              <span className="rotulo-marca-inverso">inventario</span>
            </TituloAnimado>
            <Revelar retraso={200}>
              <p className="mt-5 max-w-xl leading-relaxed text-base-content/60">
                Todo lo que hay ahora mismo en el salón de la {config.business.sedes[0].zona},{" "}
                {config.business.ciudad}. Cada unidad con su año, su kilometraje, su motor y
                su precio a la vista.
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
                <p className="display text-xl text-primary">Nada con esos filtros</p>
                <p className="mt-3 text-sm text-base-content/55">
                  Prueba a quitar alguno; el inventario cambia cada semana.
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

            {(hayPreciosProvisionales() || hayUnidadesDeMuestra()) && (
              <div className="mt-12 flex flex-wrap justify-center gap-3">
                {hayPreciosProvisionales() && <AvisoPrecioProvisional />}
                {hayUnidadesDeMuestra() && <AvisoDeMuestra />}
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
