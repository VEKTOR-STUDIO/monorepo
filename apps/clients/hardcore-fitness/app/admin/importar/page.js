import ImportadorPdf from "@/components/admin/ImportadorPdf";
import { createAdminClient, haySupabase } from "@/libs/supabase/admin";
import { fechaLarga } from "@/libs/formato";

export const dynamic = "force-dynamic";

async function leerHistorial() {
  if (!haySupabase()) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("importaciones")
      .select("archivo, total, nuevos, actualizados, desactivados, creado_en")
      .order("creado_en", { ascending: false })
      .limit(8);
    return data || [];
  } catch {
    return [];
  }
}

export default async function Importar() {
  const historial = await leerHistorial();

  return (
    <div>
      <h1 className="display text-3xl">IMPORTAR CATÁLOGO</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-content/60">
        Sube el PDF que llega por WhatsApp y la tienda se pone al día: precios, disponibilidad,
        ofertas flash y productos nuevos. Primero se muestra lo que cambiaría; nada se toca hasta
        que lo apruebes.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <ImportadorPdf />

        <aside className="space-y-6">
          <section className="ficha p-5">
            <h2 className="rotulo mb-3">Cómo funciona</h2>
            <ul className="space-y-2.5 text-xs leading-relaxed text-base-content/55">
              <li>
                Se lee la tabla del PDF columna por columna: categoría, producto, variación,
                disponibilidad y los tres precios.
              </li>
              <li>
                Un producto se reconoce por su nombre. Si el nombre cambia, entra como producto
                nuevo y el viejo se oculta.
              </li>
              <li>
                Lo que deja de venir en la lista se oculta, nunca se borra: los pedidos antiguos
                siguen apuntando a él.
              </li>
              <li>
                Las fotos salen del propio PDF. Si un producto ya tiene foto, no se sobrescribe.
              </li>
            </ul>
          </section>

          {historial.length > 0 && (
            <section className="ficha p-5">
              <h2 className="rotulo mb-3">Importaciones anteriores</h2>
              <ul className="space-y-3">
                {historial.map((registro, i) => (
                  <li key={i} className="border-b border-base-content/8 pb-3 last:border-0 last:pb-0">
                    <p className="truncate text-xs font-medium" title={registro.archivo}>
                      {registro.archivo || "Sin nombre"}
                    </p>
                    <p className="cifra mt-1 text-[0.7rem] text-base-content/45">
                      {registro.total} productos · {registro.nuevos} nuevos ·{" "}
                      {registro.desactivados} ocultos
                    </p>
                    <p className="mt-0.5 text-[0.7rem] text-base-content/35">
                      {fechaLarga(registro.creado_en)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
