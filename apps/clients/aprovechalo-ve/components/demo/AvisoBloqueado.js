import BotonComprar from "@/components/demo/BotonComprar";

/**
 * El cartelito de "esto no se puede hacer en la demo".
 *
 * Aparece donde una acción está desactivada: el contacto por un vehículo, el
 * formulario. Explica qué haría el sistema de verdad, porque decir solo
 * "desactivado" no vende nada.
 */
export default function AvisoBloqueado({ titulo, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-primary/35 bg-primary/6 p-4 ${className}`}
      role="status"
    >
      <p className="rotulo">{titulo || "Desactivado en la demo"}</p>
      <p className="mt-2 text-sm leading-relaxed text-base-content/70">{children}</p>
      <BotonComprar className="btn btn-primary btn-sm mt-4" />
    </div>
  );
}
