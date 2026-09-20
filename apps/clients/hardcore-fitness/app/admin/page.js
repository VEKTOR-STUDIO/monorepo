import Link from "next/link";
import { createAdminClient, haySupabase } from "@/libs/supabase/admin";
import { leerCatalogo } from "@/libs/catalogo";
import { leerTasaVigente } from "@/libs/bcv";
import { createClient } from "@/libs/supabase/server";
import { enDolares, enBolivares, fechaLarga, fechaCorta } from "@/libs/formato";
import EtiquetaEstado from "@/components/admin/EtiquetaEstado";

export const dynamic = "force-dynamic";

async function leerPanel() {
  const { productos, origen } = await leerCatalogo();

  const vacio = {
    origen,
    productos,
    tasa: null,
    pedidos: [],
    pedidosNuevos: 0,
    ventasMes: 0,
    ultimaImportacion: null,
  };

  if (!haySupabase()) return vacio;

  try {
    const admin = createAdminClient();
    const publico = await createClient();
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    const [tasa, pedidos, delMes, importacion] = await Promise.all([
      leerTasaVigente(publico),
      admin
        .from("pedidos")
        .select("codigo, nombre, telefono, subtotal, metodo_pago, estado, creado_en")
        .order("creado_en", { ascending: false })
        .limit(8),
      admin.from("pedidos").select("subtotal, estado").gte("creado_en", inicioMes),
      admin
        .from("importaciones")
        .select("archivo, total, creado_en")
        .order("creado_en", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const filas = delMes.data || [];

    return {
      ...vacio,
      tasa,
      pedidos: pedidos.data || [],
      pedidosNuevos: (pedidos.data || []).filter((p) => p.estado === "nuevo").length,
      ventasMes: filas
        .filter((p) => p.estado !== "cancelado")
        .reduce((suma, p) => suma + Number(p.subtotal || 0), 0),
      ultimaImportacion: importacion.data || null,
    };
  } catch {
    return vacio;
  }
}

export default async function Panel() {
  const datos = await leerPanel();
  const { productos } = datos;

  const disponibles = productos.filter((p) => p.estado === "disponible").length;
  const transito = productos.filter((p) => p.estado === "transito").length;
  const ofertas = productos.filter((p) => p.ofertaFlash).length;

  return (
    <div>
      <h1 className="display text-3xl">RESUMEN</h1>

      {datos.origen === "json" && (
        <p className="mt-5 rounded-lg border border-warning/30 bg-warning/8 px-4 py-3 text-sm text-warning">
          La tienda está leyendo el catálogo del archivo <code className="cifra">data/catalogo.json</code>,
          no de Supabase. Corre la migración y carga{" "}
          <code className="cifra">supabase/seeds/catalogo.sql</code> para poder editar desde aquí.
        </p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta
          valor={productos.length}
          etiqueta="productos en la tienda"
          pie={`${disponibles} disponibles · ${transito} en tránsito`}
          href="/admin/productos"
        />
        <Tarjeta
          valor={datos.pedidosNuevos}
          etiqueta="pedidos sin atender"
          pie={datos.pedidosNuevos > 0 ? "Requieren respuesta" : "Todo al día"}
          acento={datos.pedidosNuevos > 0}
          href="/admin/pedidos"
        />
        <Tarjeta
          valor={enDolares(datos.ventasMes)}
          etiqueta="pedidos de este mes"
          pie="Sin contar los cancelados"
          href="/admin/pedidos"
        />
        <Tarjeta
          valor={datos.tasa ? enBolivares(datos.tasa.valor) : "—"}
          etiqueta="tasa BCV"
          pie={datos.tasa ? `Del ${datos.tasa.fechaValor}` : "Sin registrar todavía"}
          acento={!datos.tasa}
          href="/admin/tasa"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <section className="ficha p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="rotulo">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-xs text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          {datos.pedidos.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/45">
              Todavía no hay pedidos.
            </p>
          ) : (
            <ul className="divide-y divide-base-content/8">
              {datos.pedidos.map((pedido) => (
                <li key={pedido.codigo} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="cifra text-sm font-medium">{pedido.codigo}</p>
                    <p className="truncate text-xs text-base-content/50">
                      {pedido.nombre} · {pedido.telefono}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="cifra text-sm font-bold text-primary">
                      {enDolares(pedido.subtotal)}
                    </p>
                    <p className="text-[0.7rem] text-base-content/40">
                      {fechaCorta(pedido.creado_en)}
                    </p>
                  </div>
                  <EtiquetaEstado estado={pedido.estado} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          <section className="ficha p-5">
            <h2 className="rotulo mb-3">Catálogo</h2>
            <dl className="space-y-2.5 text-sm">
              <Fila termino="Ofertas flash" valor={ofertas} />
              <Fila termino="En tránsito" valor={transito} />
              <Fila
                termino="Última importación"
                valor={
                  datos.ultimaImportacion
                    ? fechaCorta(datos.ultimaImportacion.creado_en)
                    : "Nunca desde el panel"
                }
              />
            </dl>
            <Link href="/admin/importar" className="btn btn-primary btn-sm mt-5 w-full">
              Importar PDF nuevo
            </Link>
          </section>

          {datos.tasa && (
            <section className="ficha p-5">
              <h2 className="rotulo mb-3">Tasa BCV</h2>
              <p className="cifra text-2xl font-bold text-primary">
                {enBolivares(datos.tasa.valor)}
              </p>
              <p className="mt-1.5 text-xs text-base-content/45">
                Fecha valor {datos.tasa.fechaValor}
              </p>
              <p className="mt-0.5 text-xs text-base-content/35">
                Leída {fechaLarga(datos.tasa.obtenidaEn)}
              </p>
              <Link href="/admin/tasa" className="btn btn-sm btn-outline mt-4 w-full">
                Ver y actualizar
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Tarjeta({ valor, etiqueta, pie, acento, href }) {
  return (
    <Link href={href} className="ficha block p-5">
      <p className={`cifra text-3xl font-bold leading-none ${acento ? "text-primary" : ""}`}>
        {valor}
      </p>
      <p className="mt-2 text-sm text-base-content/70">{etiqueta}</p>
      <p className="mt-1 text-xs text-base-content/40">{pie}</p>
    </Link>
  );
}

function Fila({ termino, valor }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-base-content/55">{termino}</dt>
      <dd className="cifra text-right">{valor}</dd>
    </div>
  );
}
