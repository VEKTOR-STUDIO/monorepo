import PantallaVehiculo from "@/components/PantallaVehiculo";
import { leerVehiculos } from "@/libs/vehiculos";

export default function Prueba() {
  const v = leerVehiculos().filter((x) => x.destacado && x.disponible).slice(0, 2);
  return (
    <main className="escaparate">
      {v.map((x, i) => (
        <PantallaVehiculo key={x.slug} vehiculo={x} tono={i % 2 === 0 ? "oscuro" : "claro"} prioridad />
      ))}
    </main>
  );
}
