"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TarjetaCandidato from "@/components/TarjetaCandidato";
import NuevoCandidato from "@/components/NuevoCandidato";
import { ETAPAS, TONOS } from "@/libs/etapas";
import { moverCandidatoAccion } from "@/app/acciones";

export default function Tablero({ candidatos }) {
  const router = useRouter();
  const [, empezar] = useTransition();
  const [arrastrando, setArrastrando] = useState(null);
  const [sobre, setSobre] = useState(null);

  // La tarjeta salta de columna en el acto y el servidor confirma después. Si
  // dice que no, los datos de verdad vuelven solos y la tarjeta regresa.
  const [vista, moverEnVista] = useOptimistic(candidatos, (estado, { id, etapa }) =>
    estado.map((c) => (c.id === id ? { ...c, etapa } : c))
  );

  // Mientras haya una rutina viva, el tablero se vuelve a pedir cada pocos
  // segundos: es la rutina, no el navegador, la que mueve esas tarjetas.
  const hayRutina = candidatos.some((c) => ["en-cola", "corriendo"].includes(c.rutina.estado));
  useEffect(() => {
    if (!hayRutina) return;
    const reloj = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(reloj);
  }, [hayRutina, router]);

  function mover(id, etapa) {
    const candidato = candidatos.find((c) => c.id === id);
    const destino = ETAPAS.find((e) => e.id === etapa);
    if (!candidato || !destino || candidato.etapa === etapa) return;

    // Soltar en «Por hacer» arranca una sesión de Claude que trabaja un buen
    // rato sobre el código. Un arrastre torpe no debería bastar para eso.
    if (destino.dispara && candidato.carpeta) {
      const seguro = window.confirm(
        `Esto lanza la rutina de Claude sobre apps/clients/${candidato.carpeta} con la skill demo-de-venta.\n\n¿La lanzo?`
      );
      if (!seguro) return;
    }

    empezar(async () => {
      moverEnVista({ id, etapa });
      const respuesta = await moverCandidatoAccion(id, etapa);
      if (!respuesta.ok) toast.error(respuesta.error);
      else if (destino.dispara) toast.success(`«${candidato.nombre}» está en la cola de la rutina.`);
    });
  }

  return (
    <main className="px-4 pb-10 pt-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="rotulo text-lg">Tablero</h1>
          <p className="mt-1 max-w-xl text-sm text-base-content/55">
            De negocio visto en Instagram a demo lista para enseñar. Arrastra una tarjeta a{" "}
            <span className="text-warning">Por hacer</span> y Claude adapta su plantilla.
          </p>
        </div>
        <p className="font-mono text-xs text-base-content/50">
          {candidatos.length} {candidatos.length === 1 ? "tarjeta" : "tarjetas"}
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="grid min-w-max auto-cols-[17.5rem] grid-flow-col gap-3 2xl:min-w-0 2xl:auto-cols-fr">
          {ETAPAS.map((etapa) => {
            const tono = TONOS[etapa.tono];
            const tarjetas = vista.filter((c) => c.etapa === etapa.id);
            const admite = arrastrando && !etapa.automatica;
            const encima = sobre === etapa.id && admite;

            return (
              <section
                key={etapa.id}
                aria-label={etapa.nombre}
                onDragOver={(e) => {
                  if (!admite) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (sobre !== etapa.id) setSobre(etapa.id);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setSobre(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  setSobre(null);
                  setArrastrando(null);
                  if (id && !etapa.automatica) mover(id, etapa.id);
                }}
                className={`flex min-h-[60vh] flex-col rounded-box border bg-base-200/50 transition-colors ${
                  encima ? `${tono.borde} bg-base-200` : "border-base-300/70"
                } ${arrastrando && etapa.automatica ? "opacity-40" : ""}`}
              >
                <header className="border-b border-base-300/70 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${tono.punto}`} />
                    <h2 className="rotulo text-[0.7rem]">{etapa.nombre}</h2>
                    <span className="ml-auto font-mono text-xs text-base-content/50">{tarjetas.length}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-snug text-base-content/55">{etapa.ayuda}</p>
                </header>

                <div className="flex flex-1 flex-col gap-2 p-2">
                  {etapa.id === "candidato" && <NuevoCandidato />}

                  {tarjetas.map((candidato) => (
                    <TarjetaCandidato
                      key={candidato.id}
                      candidato={candidato}
                      arrastrando={arrastrando === candidato.id}
                      alEmpezar={() => setArrastrando(candidato.id)}
                      alTerminar={() => {
                        setArrastrando(null);
                        setSobre(null);
                      }}
                    />
                  ))}

                  {!tarjetas.length && etapa.id !== "candidato" && (
                    <p
                      className={`m-auto px-4 text-center text-xs ${
                        encima ? tono.texto : "text-base-content/30"
                      }`}
                    >
                      {encima ? (etapa.dispara ? "Suelta para lanzar la rutina" : "Suelta aquí") : "Vacía"}
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
