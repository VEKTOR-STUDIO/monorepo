"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { guardarProducto } from "@/app/admin/acciones";
import AvisoBloqueado from "@/components/demo/AvisoBloqueado";
import { enDolares } from "@/libs/formato";
import { esDemo } from "@/libs/demo";

/**
 * Una fila de la tabla de productos que se despliega para editarse.
 *
 * Solo se editan los campos que Hardcore cambia a mano entre PDF y PDF:
 * precios, disponibilidad y si se muestra o no. El resto lo pone la
 * importación, y sobrescribirlo aquí se perdería en la siguiente.
 */
export default function EditorProducto({ producto }) {
  const [abierto, setAbierto] = useState(false);
  const [resultado, guardar, guardando] = useActionState(guardarProducto, null);
  const demo = esDemo();

  return (
    <li className="border-b border-base-content/8 last:border-0">
      <div className="flex items-center gap-3 py-3">
        <div className="foto-producto relative size-11 shrink-0 overflow-hidden rounded-lg">
          {producto.imagen && (
            <Image
              src={producto.imagen}
              alt=""
              fill
              sizes="44px"
              className="object-contain p-1"
              unoptimized
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm" title={producto.nombre}>
            {producto.nombre}
          </p>
          <p className="truncate text-xs text-base-content/45">
            {producto.categoria_original || "—"}
            {producto.marca ? ` · ${producto.marca}` : ""}
            {!producto.activo && <span className="text-warning"> · oculto</span>}
            {producto.oferta_flash && <span className="text-primary"> · oferta flash</span>}
          </p>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <p className="cifra text-sm font-bold text-primary">
            {enDolares(producto.precio_contado)}
          </p>
          <p className="cifra text-[0.7rem] text-base-content/40">
            {enDolares(producto.precio_bcv)} · {enDolares(producto.precio_pago_movil)}
          </p>
        </div>

        <span
          className={`hidden shrink-0 rounded-md border px-2 py-1 text-[0.65rem] uppercase tracking-wider md:inline ${
            producto.estado === "disponible"
              ? "border-success/40 bg-success/10 text-success"
              : "border-warning/40 bg-warning/10 text-warning"
          }`}
        >
          {producto.estado}
        </span>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="btn btn-xs btn-ghost shrink-0"
          aria-expanded={abierto}
        >
          {abierto ? "Cerrar" : "Editar"}
        </button>
      </div>

      {abierto && (
        <form action={guardar} className="grid gap-4 pb-5 sm:grid-cols-2 lg:grid-cols-4">
          <input type="hidden" name="slug" value={producto.slug} />

          <Numero etiqueta="Contado ($)" nombre="precio_contado" valor={producto.precio_contado} />
          <Numero etiqueta="BCV ($)" nombre="precio_bcv" valor={producto.precio_bcv} />
          <Numero
            etiqueta="Pago Móvil ($)"
            nombre="precio_pago_movil"
            valor={producto.precio_pago_movil}
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium">Disponibilidad</span>
            <select name="estado" defaultValue={producto.estado} className="entrada">
              <option value="disponible">Disponible</option>
              <option value="transito">En tránsito</option>
              <option value="agotado">Agotado</option>
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-5 sm:col-span-2 lg:col-span-3">
            <Casilla nombre="activo" defecto={producto.activo} texto="Visible en la tienda" />
            <Casilla nombre="oferta_flash" defecto={producto.oferta_flash} texto="Oferta flash" />
            <Casilla nombre="destacado" defecto={producto.destacado} texto="Destacado" />
          </div>

          {demo ? (
            <AvisoBloqueado titulo="No se guarda" className="sm:col-span-2 lg:col-span-4">
              En la demo los campos se pueden tocar para ver cómo es, pero el botón de guardar
              no existe. El sistema instalado sí escribe el cambio en la tienda al instante.
            </AvisoBloqueado>
          ) : (
            <div className="flex items-center gap-3">
              <button type="submit" disabled={guardando} className="btn btn-primary btn-sm">
                {guardando ? "Guardando…" : "Guardar"}
              </button>
              {resultado?.ok && <span className="text-xs text-success">{resultado.mensaje}</span>}
              {resultado && !resultado.ok && (
                <span className="text-xs text-error">{resultado.error}</span>
              )}
            </div>
          )}
        </form>
      )}
    </li>
  );
}

function Numero({ etiqueta, nombre, valor }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium">{etiqueta}</span>
      <input
        type="number"
        name={nombre}
        step="0.01"
        min="0"
        defaultValue={valor ?? ""}
        className="entrada cifra"
        placeholder="—"
      />
    </label>
  );
}

function Casilla({ nombre, defecto, texto }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={nombre} defaultChecked={defecto} className="size-4 accent-primary" />
      {texto}
    </label>
  );
}
