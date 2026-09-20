"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { contexto, TIEMPOS } from "@/libs/animaciones";
import { enBolivares } from "@/libs/formato";

/**
 * Portada.
 *
 * Las cifras no son adorno: salen del catálogo importado, así que si el PDF
 * trae 240 productos la portada dice 240 sin que nadie lo toque. Y como son
 * números de verdad, se cuentan hacia arriba al entrar.
 *
 * Toda la entrada es una sola línea de tiempo de GSAP: así los elementos se
 * encadenan con un ritmo fijo en vez de ir cada uno con su retraso a ojo.
 */
export default function HeroTienda({ total, marcas, categorias, tasa, destacados = [] }) {
  const raiz = useRef(null);

  const datos = [
    { valor: total, etiqueta: "productos en lista" },
    { valor: marcas, etiqueta: "marcas" },
    { valor: categorias, etiqueta: "categorías" },
    { valor: 3, etiqueta: "formas de pago" },
  ];

  useEffect(
    () =>
      contexto((g) => {
        const linea = g.timeline({ defaults: { duration: TIEMPOS.entrada } });

        linea
          .from("[data-hero='rotulo']", { opacity: 0, y: 14, duration: TIEMPOS.corta })
          // Los renglones del titular entran uno detrás de otro, no de golpe.
          .from(
            "[data-hero='linea']",
            { opacity: 0, yPercent: 110, stagger: 0.09, duration: 0.9 },
            "-=0.15"
          )
          .from("[data-hero='texto']", { opacity: 0, y: 22 }, "-=0.55")
          .from("[data-hero='botones'] > *", { opacity: 0, y: 18, stagger: 0.08 }, "-=0.55")
          .from("[data-hero='dato']", { opacity: 0, y: 20, stagger: 0.07 }, "-=0.5")
          .from("[data-hero='tasa']", { opacity: 0, y: 12 }, "-=0.5")
          // El collage llega desde la derecha, con las piezas escalonadas.
          .from(
            "[data-hero='pieza']",
            { opacity: 0, y: 40, scale: 0.92, stagger: 0.1, duration: 0.95 },
            0.25
          )
          .from("[data-hero='rayos']", { opacity: 0, scale: 0.6, duration: 1.2 }, 0.2);

        // La ráfaga gira muy despacio: da vida sin llamar la atención.
        g.to("[data-hero='rayos']", {
          rotation: 360,
          duration: 120,
          ease: "none",
          repeat: -1,
        });

        // Las cifras suben desde cero mientras entran.
        g.utils.toArray("[data-contador]").forEach((nodo) => {
          const destino = Number(nodo.dataset.contador);
          if (!Number.isFinite(destino)) return;

          const estado = { n: 0 };
          linea.to(
            estado,
            {
              n: destino,
              duration: 1.1,
              ease: "power2.out",
              onUpdate: () => {
                nodo.textContent = String(Math.round(estado.n));
              },
            },
            "-=0.9"
          );
        });

        // Paralaje: al bajar, el collage se queda un poco atrás respecto al
        // texto. `scrub` lo ata al scroll en vez de dispararlo una vez.
        g.to("[data-hero='collage']", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }, raiz),
    []
  );

  return (
    <section ref={raiz} className="relative overflow-hidden">
      <div className="humo absolute inset-0" aria-hidden="true" />
      {/* Panal en vez de rejilla cuadrada: es el fondo de los botes. */}
      <div
        className="panal absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          maskImage: "radial-gradient(ellipse at 50% 0%, #000 15%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 15%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-24 lg:pt-24">
        <div>
          <p data-hero="rotulo" className="rotulo">
            Caracas · Centro Lido, El Rosal
          </p>

          <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">
            {/* Cada renglón en su caja recortada: así puede subir desde abajo
                sin asomar por encima del anterior. */}
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero="linea" className="cromo block">
                TODO LO QUE
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero="linea" className="cromo block">
                TU ENTRENO
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero="linea" className="block text-primary texto-glow">
                NECESITA.
              </span>
            </span>
          </h1>

          <p
            data-hero="texto"
            className="mt-6 max-w-lg text-lg leading-relaxed text-base-content/65"
          >
            Proteínas, creatina, pre-entreno, vitaminas, accesorios de gimnasio, natación y
            bolsos. Lista actualizada, stock real y tres formas de pago.
          </p>

          <div data-hero="botones" className="mt-8 flex flex-wrap gap-3">
            <Link href="/tienda" className="btn btn-primary btn-lg">
              Ver catálogo
            </Link>
            <Link href="/tienda?ofertas=1" className="btn btn-lg btn-outline">
              Ofertas flash
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {datos.map((dato) => (
              <div key={dato.etiqueta} data-hero="dato">
                <dt className="cifra text-3xl font-bold leading-none text-primary">
                  <span data-contador={dato.valor}>{dato.valor}</span>
                </dt>
                <dd className="mt-1.5 text-[0.7rem] uppercase tracking-wider text-base-content/45">
                  {dato.etiqueta}
                </dd>
              </div>
            ))}
          </dl>

          {tasa && (
            <p
              data-hero="tasa"
              className="cristal cifra mt-8 inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs text-base-content/60"
            >
              <span className="inline-block size-1.5 animate-[latido_3.5s_ease-in-out_infinite] rounded-full bg-success" />
              Tasa BCV {enBolivares(tasa.valor)} · {tasa.fechaValor}
            </p>
          )}
        </div>

        {/* Collage de productos reales del catálogo. */}
        {destacados.length > 0 && (
          <div data-hero="collage" className="relative">
            {/* La ráfaga de rayos detrás de los botes. */}
            {/* Bien más grande que el collage: los rayos tienen que salir por
                detrás de los botes, no asomar solo por los huecos. */}
            <div
              data-hero="rayos"
              className="rayos pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[210%] -translate-x-1/2 -translate-y-1/2 opacity-30"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              {destacados.slice(0, 4).map((producto, i) => (
                <Link
                  key={producto.slug}
                  href={`/producto/${producto.slug}`}
                  data-hero="pieza"
                  className={`ficha group relative overflow-hidden ${i % 2 === 1 ? "mt-8" : ""}`}
                >
                  <div className="foto-producto relative aspect-square">
                    {producto.imagen && (
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        sizes="(max-width: 1024px) 40vw, 220px"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                        priority={i < 2}
                      />
                    )}
                  </div>
                  <p className="truncate px-3 py-2.5 text-xs text-base-content/60">
                    {producto.nombre}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
