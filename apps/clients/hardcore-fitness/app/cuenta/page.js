import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EtiquetaEstado from "@/components/admin/EtiquetaEstado";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/libs/supabase/server";
import { haySupabase } from "@/libs/supabase/admin";
import { DEV_NO_LOGIN } from "@/libs/dev-mode";
import { enDolares, enBolivares, fechaLarga } from "@/libs/formato";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = getSEOTags({
  title: "Tu cuenta · Hardcore",
  extraTags: { robots: { index: false, follow: false } },
});

export default async function Cuenta() {
  let perfil = null;
  let pedidos = [];

  if (haySupabase() && !DEV_NO_LOGIN) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const [{ data: fila }, { data: suyos }] = await Promise.all([
        supabase.from("perfiles").select("nombre, email, rol").eq("id", user.id).maybeSingle(),
        supabase
          .from("pedidos")
          .select(
            "codigo, subtotal, total_bs, metodo_pago, estado, creado_en, pedido_items(id, nombre, variacion, cantidad)"
          )
          .eq("usuario_id", user.id)
          .order("creado_en", { ascending: false }),
      ]);

      perfil = fila || { email: user.email, rol: "cliente" };
      pedidos = suyos || [];
    }
  }

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display text-3xl">TU CUENTA</h1>
            {perfil && (
              <p className="mt-2 text-sm text-base-content/55">
                {perfil.nombre ? `${perfil.nombre} · ` : ""}
                {perfil.email}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {perfil?.rol === "admin" && (
              <Link href="/admin" className="btn btn-sm btn-primary">
                Panel
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>

        <section className="mt-10">
          <h2 className="rotulo mb-4">Tus pedidos</h2>

          {pedidos.length === 0 ? (
            <div className="ficha px-6 py-14 text-center">
              <p className="display text-xl text-base-content/30">TODAVÍA NADA</p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-base-content/50">
                Aquí aparecen los pedidos que hagas con la sesión iniciada. Los que hiciste como
                invitado los tenemos por WhatsApp con su código.
              </p>
              <Link href="/tienda" className="btn btn-primary mt-6">
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {pedidos.map((pedido) => (
                <li key={pedido.codigo} className="ficha p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="cifra text-sm font-bold">{pedido.codigo}</p>
                      <p className="text-xs text-base-content/45">{fechaLarga(pedido.creado_en)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="cifra text-base font-bold text-primary">
                          {enDolares(pedido.subtotal)}
                        </p>
                        {pedido.total_bs && (
                          <p className="cifra text-[0.7rem] text-base-content/45">
                            {enBolivares(pedido.total_bs)}
                          </p>
                        )}
                      </div>
                      <EtiquetaEstado estado={pedido.estado} />
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1 border-t border-base-content/8 pt-3 text-xs text-base-content/55">
                    {(pedido.pedido_items || []).map((linea) => (
                      <li key={linea.id}>
                        <span className="cifra text-base-content/35">{linea.cantidad}× </span>
                        {linea.nombre}
                        {linea.variacion && ` · ${linea.variacion}`}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 text-xs text-base-content/40">
                    {config.pagos[pedido.metodo_pago]?.nombre || pedido.metodo_pago}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
