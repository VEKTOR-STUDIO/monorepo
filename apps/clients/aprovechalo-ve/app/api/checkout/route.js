import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { leerCatalogo, leerTasa } from "@/libs/catalogo";
import { precioSegunPago } from "@/libs/formato";
import { esDemo } from "@/libs/demo";
import config from "@/config";

export const dynamic = "force-dynamic";

// El PDF se lee con zlib y el carrito se valida contra el catálogo: runtime Node.
export const runtime = "nodejs";

const METODOS = new Set(Object.keys(config.pagos));
const ENTREGAS = new Set(Object.keys(config.entregas));

/** HC-2609-K3F8: fecha corta + cuatro caracteres al azar. Fácil de dictar. */
function generarCodigo() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin I, O, 0, 1
  let sufijo = "";
  for (let i = 0; i < 4; i++) {
    sufijo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return `HC-${dia}${mes}-${sufijo}`;
}

function limpiarTexto(valor, largoMaximo) {
  return String(valor ?? "").trim().slice(0, largoMaximo);
}

/** Mensaje que se le abre al cliente en WhatsApp ya escrito. */
function armarMensaje({ codigo, cliente, metodo, entrega, lineas, total, totalBs, tasa, nota }) {
  const partes = [
    `*Pedido ${codigo}* · Hardcore`,
    "",
    ...lineas.map(
      (l) =>
        `${l.cantidad}× ${l.nombre}${l.variacion ? ` (${l.variacion})` : ""} — $${l.subtotal.toFixed(2)}`
    ),
    "",
    `*Total: $${total.toFixed(2)}*`,
  ];

  if (totalBs) {
    partes.push(`Equivale a Bs. ${totalBs.toFixed(2)} (tasa BCV ${Number(tasa).toFixed(2)})`);
  }

  partes.push(
    "",
    `Pago: ${metodo.nombre}`,
    `Entrega: ${entrega.nombre}`,
    `Nombre: ${cliente.nombre}`,
    `Teléfono: ${cliente.telefono}`
  );

  if (cliente.direccion) partes.push(`Dirección: ${cliente.direccion}`);
  if (nota) partes.push(`Nota: ${nota}`);

  return partes.join("\n");
}

export async function POST(peticion) {
  // La demo no manda pedidos. El botón ya está desactivado en pantalla, pero
  // esta ruta es pública: sin este corte, cualquiera podría hacerle llegar
  // pedidos falsos a Hardcore por WhatsApp desde la tienda de muestra.
  if (esDemo()) {
    return NextResponse.json(
      { error: "Esto es una demo: los pedidos no se envían." },
      { status: 403 }
    );
  }

  let cuerpo;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ error: "Petición mal formada." }, { status: 400 });
  }

  // --- validación de lo que manda el navegador ---
  const nombre = limpiarTexto(cuerpo.nombre, 120);
  const telefono = limpiarTexto(cuerpo.telefono, 40);
  const email = limpiarTexto(cuerpo.email, 160) || null;
  const direccion = limpiarTexto(cuerpo.direccion, 400) || null;
  const nota = limpiarTexto(cuerpo.nota, 600) || null;
  const metodoPago = String(cuerpo.metodoPago || "");
  const entregaId = String(cuerpo.entrega || "retiro");

  if (nombre.length < 2) {
    return NextResponse.json({ error: "Falta tu nombre." }, { status: 400 });
  }
  // Un teléfono venezolano usable: al menos 7 dígitos entre todo lo escrito.
  if ((telefono.match(/\d/g) || []).length < 7) {
    return NextResponse.json({ error: "El teléfono no parece completo." }, { status: 400 });
  }
  if (!METODOS.has(metodoPago)) {
    return NextResponse.json({ error: "Elige una forma de pago." }, { status: 400 });
  }
  if (!ENTREGAS.has(entregaId)) {
    return NextResponse.json({ error: "Elige cómo quieres recibirlo." }, { status: 400 });
  }
  if (entregaId !== "retiro" && !direccion) {
    return NextResponse.json(
      { error: "Para delivery o envío hace falta una dirección." },
      { status: 400 }
    );
  }
  if (!Array.isArray(cuerpo.items) || cuerpo.items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (cuerpo.items.length > 60) {
    return NextResponse.json({ error: "Demasiadas líneas en el pedido." }, { status: 400 });
  }

  // --- el precio lo pone el catálogo, no el navegador ---
  const { productos } = await leerCatalogo();
  const porSlug = new Map(productos.map((p) => [p.slug, p]));

  const lineas = [];
  for (const item of cuerpo.items) {
    const producto = porSlug.get(String(item.slug || ""));
    if (!producto) {
      return NextResponse.json(
        { error: `"${item.slug}" ya no está en el catálogo. Quítalo del carrito.` },
        { status: 409 }
      );
    }

    const cantidad = Math.min(99, Math.max(1, Math.floor(Number(item.cantidad) || 1)));
    const precio = precioSegunPago(producto, metodoPago);
    if (precio === null) {
      return NextResponse.json(
        { error: `"${producto.nombre}" no tiene precio para esa forma de pago.` },
        { status: 409 }
      );
    }

    // La variación tiene que ser una de las que el catálogo lista.
    const variacion =
      item.variacion && producto.variaciones?.includes(item.variacion) ? item.variacion : null;

    lineas.push({
      slug: producto.slug,
      nombre: producto.nombre,
      variacion,
      cantidad,
      precioUnitario: precio,
      subtotal: Number((precio * cantidad).toFixed(2)),
    });
  }

  const total = Number(lineas.reduce((suma, l) => suma + l.subtotal, 0).toFixed(2));
  const metodo = config.pagos[metodoPago];
  const entrega = config.entregas[entregaId];

  const tasa = metodo.enBolivares ? await leerTasa() : null;
  const totalBs = tasa ? Number((total * tasa.valor).toFixed(2)) : null;

  const codigo = generarCodigo();

  // --- guardar ---
  // Si Supabase todavía no está configurado, el pedido no se pierde: se va
  // igualmente a WhatsApp y se avisa de que no quedó registrado.
  let guardado = false;
  try {
    const supabase = createAdminClient();

    // Si hay sesión, el pedido queda colgado de esa cuenta.
    let usuarioId = null;
    try {
      const conSesion = await createClient();
      const {
        data: { user },
      } = await conSesion.auth.getUser();
      usuarioId = user?.id ?? null;
    } catch {
      // Sin sesión: pedido de invitado, que es lo normal.
    }

    const { data: pedido, error: errorPedido } = await supabase
      .from("pedidos")
      .insert({
        codigo,
        usuario_id: usuarioId,
        nombre,
        telefono,
        email,
        metodo_pago: metodoPago,
        entrega: entregaId,
        direccion,
        nota,
        subtotal: total,
        tasa_bcv: tasa?.valor ?? null,
        total_bs: totalBs,
      })
      .select("id")
      .single();

    if (errorPedido) throw errorPedido;

    const { data: existentes } = await supabase
      .from("productos")
      .select("id, slug")
      .in(
        "slug",
        lineas.map((l) => l.slug)
      );
    const idPorSlug = new Map((existentes || []).map((p) => [p.slug, p.id]));

    const { error: errorItems } = await supabase.from("pedido_items").insert(
      lineas.map((l) => ({
        pedido_id: pedido.id,
        producto_id: idPorSlug.get(l.slug) ?? null,
        slug: l.slug,
        nombre: l.nombre,
        variacion: l.variacion,
        cantidad: l.cantidad,
        precio_unitario: l.precioUnitario,
        subtotal: l.subtotal,
      }))
    );
    if (errorItems) throw errorItems;

    guardado = true;
  } catch (error) {
    console.error("[checkout] no se pudo guardar el pedido:", error?.message || error);
  }

  const mensaje = armarMensaje({
    codigo,
    cliente: { nombre, telefono, direccion },
    metodo,
    entrega,
    lineas,
    total,
    totalBs,
    tasa: tasa?.valor,
    nota,
  });

  return NextResponse.json({
    codigo,
    total,
    totalBs,
    tasa: tasa?.valor ?? null,
    guardado,
    whatsapp: `https://wa.me/${config.business.whatsapp}?text=${encodeURIComponent(mensaje)}`,
  });
}
