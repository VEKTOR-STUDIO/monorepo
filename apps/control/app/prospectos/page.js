import Link from "next/link";
import Copiable from "@/components/Copiable";
import { BotonesMensaje, BotonImportar, PlantillaMensaje } from "@/components/AccionesProspectos";
import { componerMensaje, leerPlantillaMensaje, listarProspectos, marcasConVideo, videosDe } from "@/libs/prospectos.mjs";
import { ESTADOS, estadoPorId, TONOS_CONTACTO } from "@/libs/contacto";
import { fechaCorta, haceCuanto } from "@/libs/formato";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prospectos" };

export default function PaginaProspectos() {
  const plantilla = leerPlantillaMensaje();
  // El mensaje se compone aquí, en el servidor, y viaja ya rellenado a los
  // botones de cada fila: copiar o abrir WhatsApp no necesita abrir la ficha.
  const prospectos = listarProspectos().map((p) => ({
    ...p,
    videos: videosDe(p.id),
    mensajeListo: componerMensaje(p, plantilla),
  }));
  const enEstudio = marcasConVideo();
  const sinImportar = enEstudio.filter((m) => !prospectos.some((p) => p.id === m.id));
  const cuenta = (estado) => prospectos.filter((p) => p.estado === estado).length;

  // Los que tienen fecha de seguimiento vencida o de hoy, arriba del todo.
  const hoy = new Date().toISOString().slice(0, 10);
  const orden = [...prospectos].sort((a, b) => {
    const va = a.seguimientoEl && a.seguimientoEl <= hoy ? 0 : 1;
    const vb = b.seguimientoEl && b.seguimientoEl <= hoy ? 0 : 1;
    if (va !== vb) return va - vb;
    return ESTADOS.findIndex((e) => e.id === a.estado) - ESTADOS.findIndex((e) => e.id === b.estado);
  });

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="rotulo text-lg">Prospectos</h1>
          <p className="mt-1 max-w-2xl text-sm text-base-content/55">
            Los negocios que ya tienen demo publicada y video. Aquí se lleva la conversación: a quién le escribiste, qué
            contestó y qué toca ahora. El mensaje sale listo con su enlace y su contraseña.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <dl className="flex gap-5 font-mono text-xs text-base-content/50">
            <Cifra valor={prospectos.length} etiqueta="prospectos" />
            <Cifra valor={cuenta("por-contactar")} etiqueta="por contactar" aviso={cuenta("por-contactar") > 0} />
            <Cifra valor={cuenta("contactado") + cuenta("respondio") + cuenta("negociando")} etiqueta="en conversación" />
            <Cifra valor={cuenta("vendido")} etiqueta="vendidos" />
          </dl>
          <BotonImportar etiqueta={sinImportar.length ? `Importar ${sinImportar.length} del estudio` : "Importar desde los videos"} />
        </div>
      </div>

      {prospectos.length === 0 ? (
        <section className="rounded-box border border-dashed border-base-300 p-8 text-center">
          <p className="text-sm text-base-content/70">Todavía no hay prospectos.</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-base-content/50">
            Se importan desde <code className="font-mono">apps/video</code>: cada marca con video entra con su enlace de
            Vercel, su contraseña, su Instagram y su WhatsApp leídos de la carpeta del cliente.
            {enEstudio.length > 0 && ` Ahora mismo hay ${enEstudio.length} con video.`}
          </p>
        </section>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-200/50">
          <table className="w-full min-w-[74rem] text-left text-sm">
            <thead className="border-b border-base-300 text-xs text-base-content/55">
              <tr>
                <th className="px-4 py-2.5 font-normal">Negocio</th>
                <th className="px-3 py-2.5 font-normal">Estado</th>
                <th className="px-3 py-2.5 font-normal">Contacto</th>
                <th className="px-3 py-2.5 font-normal">Demo</th>
                <th className="px-3 py-2.5 font-normal">Video</th>
                <th className="px-3 py-2.5 font-normal">Último mensaje</th>
                <th className="px-3 py-2.5 font-normal">Siguiente</th>
                <th className="px-4 py-2.5 font-normal">Escribirle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/60">
              {orden.map((p) => {
                const estado = estadoPorId(p.estado);
                const tono = TONOS_CONTACTO[estado.tono];
                const vencido = p.seguimientoEl && p.seguimientoEl <= hoy && !["vendido", "descartado"].includes(p.estado);
                return (
                  <tr key={p.id} className="align-top">
                    <td className="max-w-xs px-4 py-3">
                      <Link href={`/prospectos/${p.id}`} className="font-medium hover:underline">
                        {p.nombre}
                      </Link>
                      <p className="mt-0.5 text-xs text-base-content/50">
                        {[p.ciudad, p.persona].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-1 font-mono text-[0.6875rem] text-base-content/40">apps/clients/{p.carpeta}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-field border px-2 py-1 text-xs ${tono.borde} ${tono.texto}`}>
                        <span className={`size-1.5 rounded-full ${tono.punto}`} />
                        {estado.nombre}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {p.whatsapp ? (
                        <p className="font-mono text-base-content/80">+{p.whatsapp.replace(/\D/g, "")}</p>
                      ) : (
                        <p className="text-accent">Sin WhatsApp</p>
                      )}
                      {p.instagram ? (
                        <p className="mt-1 text-base-content/55">@{p.instagram.replace(/^@/, "")}</p>
                      ) : (
                        <p className="mt-1 text-base-content/40">sin Instagram</p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {p.enlace ? (
                        <a href={p.enlace} target="_blank" rel="noreferrer" className="block max-w-56 truncate font-mono text-base-content/80 hover:underline">
                          {p.enlace.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <p className="text-accent">Sin enlace</p>
                      )}
                      <div className="mt-1">
                        {p.clave ? <Copiable texto={p.clave} oculto className="max-w-56" /> : <span className="text-accent">sin clave</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.videos.map((v) => (
                          <Marca key={v.formato} className={v.existe ? "border-success/40 text-success" : "border-base-300 text-base-content/40"}>
                            {v.formato} {v.existe ? "✓" : "—"}
                          </Marca>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {p.ultimoContacto ? (
                        <>
                          <p className="text-base-content/80" suppressHydrationWarning>{haceCuanto(p.ultimoContacto)}</p>
                          <p className="mt-0.5 text-base-content/45" suppressHydrationWarning>{fechaCorta(p.ultimoContacto)}</p>
                        </>
                      ) : (
                        <span className="text-base-content/40">Nunca</span>
                      )}
                    </td>
                    <td className="max-w-56 px-3 py-3 text-xs">
                      {p.seguimientoEl && (
                        <p className={`font-mono ${vencido ? "text-warning" : "text-base-content/60"}`}>{p.seguimientoEl}</p>
                      )}
                      <p className="mt-0.5 line-clamp-2 leading-snug text-base-content/60">{p.proximoPaso || (p.respuesta ? "—" : "")}</p>
                    </td>
                    <td className="px-4 py-3">
                      {["vendido", "descartado"].includes(p.estado) ? (
                        <span className="text-xs text-base-content/40">—</span>
                      ) : (
                        <BotonesMensaje id={p.id} mensaje={p.mensajeListo} whatsapp={p.whatsapp} canal={p.canal} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5">
        <PlantillaMensaje plantilla={plantilla} />
      </div>

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-base-content/50">
        Los datos entran una vez desde <code className="font-mono">apps/video</code> y la carpeta del cliente; después
        mandan los de aquí. Un prospecto sin WhatsApp se contacta por Instagram. La contraseña que se muestra es la del{" "}
        <code className="font-mono">.env.local</code> o la de reserva del código: si en Vercel se puso otra, corrígela en su ficha.
      </p>
    </main>
  );
}

function Cifra({ valor, etiqueta, aviso = false }) {
  return (
    <div>
      <dd className={`text-lg ${aviso ? "text-accent" : "text-base-content"}`}>{valor}</dd>
      <dt className="font-sans text-[0.6875rem]">{etiqueta}</dt>
    </div>
  );
}

function Marca({ className = "border-base-300 text-base-content/55", children }) {
  return <span className={`rounded-selector border px-1.5 py-0.5 text-[0.6875rem] ${className}`}>{children}</span>;
}
