import FichaVehiculo from "@/components/FichaVehiculo";

/** La cuadrícula del listado. Las tres primeras fotos cargan con prioridad. */
export default function RejillaVehiculos({ vehiculos, className = "" }) {
  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {vehiculos.map((vehiculo, i) => (
        <FichaVehiculo key={vehiculo.slug} vehiculo={vehiculo} prioridad={i < 3} />
      ))}
    </div>
  );
}
