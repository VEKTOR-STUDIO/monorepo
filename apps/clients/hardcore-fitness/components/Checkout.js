"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCarrito } from "@/components/CarritoContext";
import AvisoBloqueado from "@/components/demo/AvisoBloqueado";
import { enDolares, enBolivares, aBolivares } from "@/libs/formato";
import { esDemo } from "@/libs/demo";
import config from "@/config";

const PAGOS = Object.values(config.pagos);
const ENTREGAS = Object.values(config.entregas);

export default function Checkout({ tasa }) {
  const router = useRouter();
  const { items, unidades, totalCon, vaciar } = useCarrito();
  const demo = esDemo();

  const [metodoPago, setMetodoPago] = useState("contado");
  const [entrega, setEntrega] = useState("retiro");
  const [enviando, setEnviando] = useState(false);
  const [datos, setDatos] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    nota: "",
  });

  const pago = config.pagos[metodoPago];
  const total = totalCon(metodoPago);
  const totalBs = pago.enBolivares ? aBolivares(total, tasa?.valor) : null;
  const necesitaDireccion = entrega !== "retiro";

  // Algún producto puede no tener precio para la forma de pago elegida.
  const sinPrecio = useMemo(
    () => items.filter((l) => l.precios?.[metodoPago] === null || l.precios?.[metodoPago] === undefined),
    [items, metodoPago]
  );

  const cambiar = (campo) => (evento) =>
    setDatos((previos) => ({ ...previos, [campo]: evento.target.value }));

  const enviar = async (evento) => {
    evento.preventDefault();
    if (enviando || items.length === 0) return;

    // En demo el pedido no sale de aquí: nadie debería llegarle a Hardcore por
    // WhatsApp desde una tienda de muestra. El servidor lo rechaza igualmente.
    if (demo) {
      toast("El pedido no se envía: esto es una demo.", { icon: "🔒" });
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...datos,
          metodoPago,
          entrega,
          items: items.map((l) => ({
            slug: l.slug,
            variacion: l.variacion,
            cantidad: l.cantidad,
          })),
        }),
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || "No se pudo registrar el pedido.");

      // La confirmación se lee de aquí: así funciona aunque el pedido no se
      // haya podido guardar (Supabase sin configurar todavía).
      try {
        window.sessionStorage.setItem(
          `hardcore.pedido.${resultado.codigo}`,
          JSON.stringify({
            ...resultado,
            metodoPago,
            entrega,
            nombre: datos.nombre,
            items: items.map((l) => ({
              nombre: l.nombre,
              variacion: l.variacion,
              cantidad: l.cantidad,
            })),
          })
        );
      } catch {
        // Sin sessionStorage la confirmación sale más escueta, nada más.
      }

      vaciar();

      // WhatsApp en una pestaña nueva y la confirmación en esta.
      window.open(resultado.whatsapp, "_blank", "noopener,noreferrer");
      router.push(`/pedido/${resultado.codigo}`);
    } catch (error) {
      toast.error(error.message);
      setEnviando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="ficha flex flex-col items-center gap-4 px-6 py-20 text-center">
        <p className="display text-2xl text-base-content/30">NADA QUE CONFIRMAR</p>
        <Link href="/tienda" className="btn btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="space-y-8">
        <section className="ficha p-5 sm:p-6">
          <h2 className="rotulo mb-5">Tus datos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Nombre y apellido" requerido>
              <input
                type="text"
                required
                value={datos.nombre}
                onChange={cambiar("nombre")}
                autoComplete="name"
                className="entrada"
                placeholder="María Pérez"
              />
            </Campo>

            <Campo etiqueta="Teléfono / WhatsApp" requerido>
              <input
                type="tel"
                required
                value={datos.telefono}
                onChange={cambiar("telefono")}
                autoComplete="tel"
                className="entrada"
                placeholder="0412 1234567"
              />
            </Campo>

            <Campo etiqueta="Correo" ayuda="Opcional" className="sm:col-span-2">
              <input
                type="email"
                value={datos.email}
                onChange={cambiar("email")}
                autoComplete="email"
                className="entrada"
                placeholder="maria@correo.com"
              />
            </Campo>
          </div>
        </section>

        <section className="ficha p-5 sm:p-6">
          <h2 className="rotulo mb-5">Cómo pagas</h2>
          <div className="grid gap-2.5">
            {PAGOS.map((opcion) => (
              <Radio
                key={opcion.id}
                nombre="metodoPago"
                valor={opcion.id}
                elegido={metodoPago}
                onChange={setMetodoPago}
                titulo={opcion.nombre}
                detalle={opcion.detalle}
                extra={enDolares(totalCon(opcion.id))}
              />
            ))}
          </div>

          {sinPrecio.length > 0 && (
            <p className="mt-4 rounded-lg border border-warning/30 bg-warning/8 px-3.5 py-2.5 text-xs text-warning">
              {sinPrecio.length === 1
                ? `"${sinPrecio[0].nombre}" no tiene precio con esa forma de pago.`
                : `${sinPrecio.length} productos no tienen precio con esa forma de pago.`}{" "}
              Elige otra o quítalos del carrito.
            </p>
          )}
        </section>

        <section className="ficha p-5 sm:p-6">
          <h2 className="rotulo mb-5">Cómo lo recibes</h2>
          <div className="grid gap-2.5">
            {ENTREGAS.map((opcion) => (
              <Radio
                key={opcion.id}
                nombre="entrega"
                valor={opcion.id}
                elegido={entrega}
                onChange={setEntrega}
                titulo={opcion.nombre}
                detalle={opcion.detalle}
              />
            ))}
          </div>

          {necesitaDireccion && (
            <div className="mt-4">
              <Campo etiqueta="Dirección de entrega" requerido>
                <textarea
                  required
                  rows={3}
                  value={datos.direccion}
                  onChange={cambiar("direccion")}
                  className="entrada resize-none"
                  placeholder="Calle, edificio, piso, punto de referencia y ciudad"
                />
              </Campo>
            </div>
          )}

          <div className="mt-4">
            <Campo etiqueta="Nota para el pedido" ayuda="Opcional">
              <textarea
                rows={2}
                value={datos.nota}
                onChange={cambiar("nota")}
                className="entrada resize-none"
                placeholder="Horario para recibir, sabor alternativo si no hay…"
              />
            </Campo>
          </div>
        </section>
      </div>

      <aside className="ficha sticky top-24 p-5">
        <h2 className="rotulo mb-4">Tu pedido</h2>

        <ul className="mb-4 space-y-2.5 border-b border-base-content/10 pb-4">
          {items.map((linea) => (
            <li key={linea.id} className="flex justify-between gap-3 text-sm">
              <span className="min-w-0 text-base-content/70">
                <span className="cifra text-base-content/45">{linea.cantidad}× </span>
                <span className="line-clamp-2">{linea.nombre}</span>
                {linea.variacion && (
                  <span className="block text-xs text-base-content/40">{linea.variacion}</span>
                )}
              </span>
              <span className="cifra shrink-0">
                {enDolares((linea.precios?.[metodoPago] ?? 0) * linea.cantidad)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline justify-between">
          <span className="text-sm text-base-content/60">
            Total · {unidades} {unidades === 1 ? "artículo" : "artículos"}
          </span>
          <span className="cifra text-2xl font-bold text-primary">{enDolares(total)}</span>
        </div>

        {totalBs !== null && (
          <p className="cifra mt-1.5 text-right text-sm text-base-content/55">
            {enBolivares(totalBs)}
          </p>
        )}

        <p className="mt-2 text-[0.7rem] text-base-content/45">{pago.detalle}</p>

        <button type="submit" disabled={enviando} className="btn btn-primary mt-5 w-full">
          {enviando ? "Registrando…" : "Confirmar por WhatsApp"}
        </button>

        <p className="mt-3 text-center text-[0.7rem] text-base-content/40">
          Se abre WhatsApp con el resumen ya escrito. El pago y la entrega se cierran ahí.
        </p>
      </aside>
    </form>
  );
}

function Campo({ etiqueta, ayuda, requerido, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline gap-2 text-sm font-medium">
        {etiqueta}
        {requerido && <span className="text-primary">*</span>}
        {ayuda && <span className="text-xs font-normal text-base-content/40">{ayuda}</span>}
      </span>
      {children}
    </label>
  );
}

function Radio({ nombre, valor, elegido, onChange, titulo, detalle, extra }) {
  const activo = elegido === valor;

  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
        activo ? "border-primary bg-primary/8" : "border-base-content/12 hover:border-base-content/25"
      }`}
    >
      <input
        type="radio"
        name={nombre}
        value={valor}
        checked={activo}
        onChange={() => onChange(valor)}
        className="sr-only"
      />
      <span
        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          activo ? "border-primary" : "border-base-content/30"
        }`}
        aria-hidden="true"
      >
        {activo && <span className="size-2 rounded-full bg-primary" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-medium">{titulo}</span>
          {extra && <span className="cifra text-sm text-base-content/55">{extra}</span>}
        </span>
        <span className="mt-0.5 block text-xs text-base-content/50">{detalle}</span>
      </span>
    </label>
  );
}
