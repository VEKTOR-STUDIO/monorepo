import CaosManualScreen from "@/components/rollprep/CaosManualScreen";

export const metadata = {
  title: "Manual del Torneo CAOS",
};

// Manual del modo CAOS para el alumno: el mismo códice que se publica en
// /caos/manual, pero con la vuelta a los torneos y la barra del dashboard.
export default function ManualCaos() {
  return <CaosManualScreen backHref="/dashboard/torneos" backLabel="Torneos" />;
}
