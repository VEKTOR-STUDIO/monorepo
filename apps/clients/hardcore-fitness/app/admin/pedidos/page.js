import Link from "next/link";
import FichaPedido from "@/components/admin/FichaPedido";
import { createAdminClient, haySupabase } from "@/libs/supabase/admin";
import { leerCatalogo } from "@/libs/catalogo";
import { enDolares } from "@/libs/formato";
import { esDemo, pedidosDeEjemplo } from "@/libs/demo";

export const dynamic = "force-dynamic";

const ESTADOS = [
  ["todos", "Todos"],
  ["nuevo", "Sin atender"],
  ["confirmado", "Confirmados"],
  ["entregado", "Entregados"],
  ["cancelado", "Cancelados"],
];

export default async function Pedidos({ searchParams }) {
  const p = (await searchParams) || {};
  const estado = p.estado || "todos";

  // En demo nunca se consulta la tabla de pedidos: se enseñan ejemplos.
  if (esDemo()) {
    const { productos } = await leerCatalogo();
    const ejemplos = pedidosDeEjemplo(productos).filter(
      (p) => estado === "todos" || p.estado === estado
    );
    return <Listado estado={estado} pedidos={ejemplos} esEjemplo />;
  }

  if (!haySupabase()) {
    return (
      <div className="ficha px-6 py-16 text-center">
        <h1 className="display text-2xl">SIN BASE DE DATOS</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-base-content/55">
          Los pedidos se guardan en Supabase. Conéctalo y corre la migración para verlos aquí.
        </p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const consulta = supabase
    .from("pedidos")
    .select(
      "codigo, nombre, telefono, email, direccion, nota, metodo_pago, entrega, subtotal, tasa_bcv, total_bs, estado, creado_en, pedido_items(id, nombre, variacion, cantidad, precio_unitario, subtotal)"
    )
    .order("creado_en", { ascending: false })
    .limit(200);

  if (estado !== "todos") consulta.eq("estado", estado);

  const { data: pedidos, error } = await consulta;

  if (error) {
    return (
      <div className="ficha px-6 py-16 text-center">
        <h1 className="display text-2xl">NO SE PUDIERON LEER LOS PEDIDOS</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-base-content/55">{error.message}</p>
      </div>
    );
  }

  return <Listado estado={estado} pedidos={pedidos || []} />;
}

function Listado({ estado, pedidos, esEjemplo = false }) {
  const total = pedidos
    .filter((x) => x.estado !== "cancelado")
    .reduce((suma, x) => suma + Number(x.subtotal || 0), 0);

  return (
    <div>
      <h1 className="display text-3xl">PEDIDOS</h1>

      {esEjemplo && (
        <p className="mt-4 rounded-lg border border-base-content/15 bg-base-200/50 px-4 py-2.5 text-xs text-base-content/55">
          Pedidos de ejemplo, inventados para que se vea cómo funciona la pantalla. Los reales
          aparecen aquí en cuanto alguien compra.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {ESTADOS.map(([id, texto]) => (
          <Link
            key={id}
            href={id === "todos" ? "/admin/pedidos" : `/admin/pedidos?estado=${id}`}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              estado === id ? "bg-primary/12 text-primary" : "text-base-content/60 hover:bg-base-200"
            }`}
          >
            {texto}
          </Link>
        ))}
      </div>

      <p className="cifra mt-5 text-sm text-base-content/45">
        {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"} · {enDolares(total)} sin
        contar cancelados
      </p>

      {pedidos.length === 0 ? (
        <div className="ficha mt-4 px-6 py-16 text-center">
          <p className="display text-xl text-base-content/30">NADA POR AQUÍ</p>
          <p className="mt-3 text-sm text-base-content/50">
            Los pedidos aparecen en cuanto alguien confirma uno desde la tienda.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {pedidos.map((pedido) => (
            <FichaPedido key={pedido.codigo} pedido={pedido} />
          ))}
        </ul>
      )}
    </div>
  );
}
