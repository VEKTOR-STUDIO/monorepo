"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import FotoVehiculo from "@/components/FotoVehiculo";
import { usarGsap } from "@/libs/animaciones";
import { enDolares, enCuota } from "@/libs/formato";

// -----------------------------------------------------------------------------
// El catálogo, de lado.
//
// Su escaparate es una cuadrícula de Instagram que se pasa con el dedo, y esta
// sección es eso mismo puesto en horizontal: la página se queda quieta y las
// unidades desfilan de derecha a izquierda mientras bajas. Es el movimiento más
// fuerte del sitio y está puesto justo donde hace falta —arriba, después de la
// portada— porque es lo que contesta de un golpe la pregunta "¿qué tienen?".
//
// Dos decisiones que no son de gusto:
//
//   · SOLO EN ESCRITORIO. Secuestrar el scroll en un teléfono es una de las
//     peores cosas que se le pueden hacer a alguien que entró a ver carros.
//     En móvil la misma lista se arrastra con el dedo, con encaje por ficha,
//     que es el gesto que ya conocen de Instagram.
//   · CON `scrub`. El desfile va atado a la rueda, no lanzado por su cuenta:
//     si te paras, se para; si subes, retrocede. Quien lo controla es quien
//     mira, no la animación.
// -----------------------------------------------------------------------------

export default function CarruselCatalogo({ vehiculos }) {
  const seccion = useRef(null);
  const pista = useRef(null);
  const barra = useRef(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = usarGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Cuánto le sobra a la pista por la derecha. Se recalcula en cada
          // `refresh` —con invalidateOnRefresh— porque al cambiar el ancho de
          // la ventana cambian las dos medidas a la vez.
          const recorrido = () =>
            Math.max(0, pista.current.scrollWidth - seccion.current.offsetWidth);

          const desfile = gsap.to(pista.current, {
            x: () => -recorrido(),
            ease: "none",
            scrollTrigger: {
              trigger: seccion.current,
              pin: true,
              scrub: 0.6,
              start: "top top",
              // El alto que se "gasta" bajando es el mismo que hay que
              // recorrer de lado, más una pantalla de margen para que la
              // última ficha se quede un momento a la vista.
              end: () => `+=${recorrido() + window.innerHeight * 0.6}`,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // La barrita de abajo va contando lo mismo que el desfile.
          gsap.fromTo(
            barra.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: seccion.current,
                start: "top top",
                end: () => `+=${recorrido() + window.innerHeight * 0.6}`,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          );

          return () => desfile.kill();
        }
      );
    }, seccion);

    // Las fotos entran después del primer cálculo y cambian el ancho de la
    // pista. Sin esto, el recorrido se queda corto y las últimas fichas no
    // llegan a verse.
    const alCargar = () => ScrollTrigger.refresh();
    window.addEventListener("load", alCargar);

    return () => {
      window.removeEventListener("load", alCargar);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={seccion}
      className="relative overflow-hidden border-t border-base-content/8 bg-base-100"
      aria-label="Catálogo completo"
    >
      <div className="textura absolute inset-0" aria-hidden="true" />

      <div className="relative flex min-h-svh flex-col justify-center py-16 lg:py-0">
        {/* Encabezado, pegado a la izquierda como el modelo en sus fichas. */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <span className="filete" aria-hidden="true" />
          <h2 className="display mt-5 text-4xl sm:text-5xl lg:text-6xl">
            Todo lo que puedes
            <span className="text-primary"> financiar</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-base-content/55 lg:text-base">
            Las {vehiculos.length} unidades, una por una, con su cuota a la vista:
            vehículos y motos.{" "}
            <span className="hidden lg:inline">Sigue bajando y desfilan solas.</span>
            <span className="lg:hidden">Arrastra para verlas.</span>
          </p>
        </div>

        {/* La pista. En escritorio la mueve GSAP; en móvil, el dedo. */}
        <div className="mt-10 overflow-x-auto overflow-y-hidden pb-4 lg:overflow-visible lg:pb-0">
          <div
            ref={pista}
            className="flex w-max gap-5 px-4 [scroll-snap-type:x_mandatory] sm:px-6 lg:px-10"
          >
            {vehiculos.map((vehiculo, i) => (
              <Link
                key={vehiculo.slug}
                href={`/unidad/${vehiculo.slug}`}
                className="ficha group block w-64 shrink-0 overflow-hidden [scroll-snap-align:center] sm:w-72 lg:w-80"
              >
                <FotoVehiculo
                  vehiculo={vehiculo}
                  prioridad={i < 2}
                  className="aspect-4/5 w-full"
                  sizes="(max-width: 640px) 16rem, (max-width: 1024px) 18rem, 20rem"
                />

                {/* Nada encima de la imagen: las cuatro esquinas de sus
                    publicaciones ya están ocupadas. La condición va debajo. */}
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`shrink-0 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider ${
                        vehiculo.esNuevo ? "pastilla" : "pastilla pastilla-apagada"
                      }`}
                    >
                      {vehiculo.esNuevo ? "0 km" : "Usado"}
                    </span>
                    <p className="display-recto min-w-0 truncate text-xs tracking-wide text-base-content/60">
                      {vehiculo.tituloLargo}
                    </p>
                  </div>

                  {/* Igual que en la tarjeta del catálogo: manda la cuota y el
                      contado va detrás. Ver components/FichaVehiculo.js. */}
                  <div className="mt-2.5 flex items-end justify-between gap-3">
                    <p className="flex min-w-0 items-baseline gap-1.5">
                      <span className="cuota text-xl leading-none">
                        {enCuota(vehiculo.cuota).cifra}
                      </span>
                      <span className="cuota-periodo truncate text-[0.6rem]">
                        {enCuota(vehiculo.cuota).periodo}
                      </span>
                    </p>
                    <p className="cifra shrink-0 text-[0.65rem] text-base-content/40">
                      {enDolares(vehiculo.precio)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {/* El final de la pista: a dónde se va después de verlas todas. */}
            <Link
              href="/catalogo"
              className="ficha flex w-64 shrink-0 flex-col items-center justify-center gap-4 p-8 text-center [scroll-snap-align:center] sm:w-72 lg:w-80"
            >
              <span className="display text-3xl text-primary">Ver todo el catálogo</span>
              <span className="text-sm text-base-content/55">
                Con filtros por vehículo o moto, condición, marca y cuota máxima.
              </span>
              <span className="btn btn-primary mt-2">Entrar al catálogo</span>
            </Link>
          </div>
        </div>

        {/* Cuánto llevas del desfile. Solo donde hay desfile. */}
        <div className="mx-auto mt-8 hidden w-full max-w-7xl px-4 sm:px-6 lg:block">
          <div className="h-px w-full bg-base-content/12" aria-hidden="true">
            <div ref={barra} className="progreso h-px w-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
