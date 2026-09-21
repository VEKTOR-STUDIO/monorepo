import Link from "next/link";
import Copiable from "@/components/Copiable";
import { listarCandidatos } from "@/libs/almacen.mjs";
import { listarClientes } from "@/libs/clientes.mjs";
import { etapaPorId, TONOS } from "@/libs/etapas";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clientes" };

export default async function PaginaClientes() {
  const clientes = await listarClientes();
  const tarjetas = new Map(listarCandidatos().filter((c) => c.carpeta).map((c) => [c.carpeta, c]));

  const conDemo = clientes.filter((c) => c.tieneDemo && !c.demoApagada).length;
  const sinSubir = clientes.filter((c) => c.cambios > 0).length;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="rotulo text-lg">Clientes</h1>
          <p className="mt-1 text-sm text-base-content/55">
            Todo lo que hay en <code className="font-mono text-xs">apps/clients</code>, leído del disco y de git ahora mismo.
          </p>
        </div>
        <dl className="flex gap-6 font-mono text-xs text-base-content/50">
          <Cifra valor={clientes.length} etiqueta="carpetas" />
          <Cifra valor={conDemo} etiqueta="en modo demo" />
          <Cifra valor={sinSubir} etiqueta="con cambios sin subir" aviso={sinSubir > 0} />
        </dl>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-200/50">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-base-300 text-xs text-base-content/55">
            <tr>
              <th className="px-4 py-2.5 font-normal">Carpeta</th>
              <th className="px-3 py-2.5 font-normal">Estado</th>
              <th className="px-3 py-2.5 font-normal">Último commit</th>
              <th className="px-3 py-2.5 font-normal">Tablero</th>
              <th className="px-4 py-2.5 font-normal">Levantarla</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300/60">
            {clientes.map((c) => {
              const tarjeta = tarjetas.get(c.carpeta);
              const etapa = tarjeta ? etapaPorId(tarjeta.etapa) : null;
              return (
                <tr key={c.carpeta} className="align-top">
                  <td className="max-w-md px-4 py-3">
                    <p className="font-mono text-xs font-medium">{c.carpeta}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-snug text-base-content/50">
                      {c.descripcion || "Sin descripción en su package.json."}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tieneDemo ? (
                        c.demoApagada ? (
                          <Marca className="border-success/40 text-success">entregada</Marca>
                        ) : (
                          <Marca className="border-warning/40 text-warning">demo</Marca>
                        )
                      ) : (
                        <Marca>sin demo</Marca>
                      )}
                      {c.enVercel && <Marca className="border-info/40 text-info">vercel</Marca>}
                      {!c.tieneEnv && <Marca className="border-error/40 text-error">sin .env.local</Marca>}
                      {c.cambios > 0 && <Marca className="border-accent/40 text-accent">{c.cambios} sin subir</Marca>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {c.commit ? (
                      <>
                        <p className="font-mono text-base-content/70">{c.commit.fecha}</p>
                        <p className="mt-1 line-clamp-2 max-w-64 leading-snug text-base-content/55">{c.commit.asunto}</p>
                      </>
                    ) : (
                      <span className="text-accent">Nunca se ha subido</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {tarjeta ? (
                      <Link href={`/candidatos/${tarjeta.id}`} className="inline-flex items-center gap-1.5 hover:underline">
                        <span className={`size-1.5 rounded-full ${TONOS[etapa.tono].punto}`} />
                        {etapa.nombre}
                      </Link>
                    ) : (
                      <span className="text-base-content/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Copiable texto={`pnpm --filter ${c.paquete} dev`} className="max-w-72" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-base-content/50">
        «vercel» significa que la carpeta tiene un <code className="font-mono">.vercel/project.json</code> en este equipo,
        no que el despliegue esté al día. «entregada» es una demo con <code className="font-mono">NEXT_PUBLIC_DEMO=false</code>{" "}
        en su <code className="font-mono">.env.local</code>.
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
