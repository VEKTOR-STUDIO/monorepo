import FichaVehiculo from "@/components/FichaVehiculo";
import Revelar from "@/components/Revelar";

/**
 * La cuadrícula del catálogo.
 *
 * Cada tarjeta entra girada y se endereza, escalonadas de a poco. El retraso
 * se calcula por COLUMNA y no por posición en la lista: si fuera por posición,
 * la última tarjeta de una lista de doce esperaría casi un segundo, y en una
 * rejilla de tres columnas la fila de abajo entraría mucho después que la de
 * arriba aunque las dos hayan aparecido a la vez.
 *
 * Las tres primeras fotos cargan con prioridad.
 */
export default function RejillaVehiculos({ vehiculos, className = "", columnas = 3 }) {
  const rejilla =
    columnas === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columnas === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-5 ${rejilla} ${className}`}>
      {vehiculos.map((vehiculo, i) => (
        <Revelar key={vehiculo.slug} desde="giro" retraso={(i % columnas) * 110}>
          <FichaVehiculo vehiculo={vehiculo} prioridad={i < 3} />
        </Revelar>
      ))}
    </div>
  );
}
