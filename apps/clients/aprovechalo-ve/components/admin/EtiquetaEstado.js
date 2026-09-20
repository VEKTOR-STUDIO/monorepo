const ESTILOS = {
  nuevo: "border-primary/40 bg-primary/10 text-primary",
  confirmado: "border-info/40 bg-info/10 text-info",
  entregado: "border-success/40 bg-success/10 text-success",
  cancelado: "border-base-content/15 bg-base-200 text-base-content/40",
};

/** El estado de un pedido, con el color que le toca. */
export default function EtiquetaEstado({ estado }) {
  return (
    <span
      className={`shrink-0 rounded-md border px-2 py-1 text-[0.65rem] uppercase tracking-wider ${
        ESTILOS[estado] || ESTILOS.nuevo
      }`}
    >
      {estado}
    </span>
  );
}
