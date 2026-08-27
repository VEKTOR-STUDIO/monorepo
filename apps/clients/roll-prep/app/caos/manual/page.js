import CaosManualScreen from "@/components/rollprep/CaosManualScreen";
import JoinCta from "@/components/rollprep/JoinCta";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

// El manual del CAOS, abierto. Es la respuesta a la pregunta que hace todo el
// que ve el flyer: "¿y eso de que cada pelea se rolea, cómo funciona?".
// Pedirle cuenta para leer las reglas es pedirle fe: aquí se leen completas y
// después se decide. Es el mismo códice que ve el alumno en su dashboard.
export const metadata = getSEOTags({
  title: `Manual del Torneo CAOS · ${config.appName}`,
  description:
    "Las reglas completas del Torneo CAOS: el juramento, los terrenos, las cartas de duelo, las probabilidades y cuánto paga cada resultado.",
  canonicalUrlRelative: "/caos/manual",
});

export default function ManualCaosPublico() {
  return (
    <CaosManualScreen
      backHref="/caos"
      backLabel="Cartelera CAOS"
      footer={
        <div className="rise rise-5 border-t border-base-300 pt-6 text-center">
          <p className="text-xs font-medium opacity-60">
            El bracket, los puntos y el ranking CAOS viven en {config.appName}.
          </p>
          <JoinCta
            next="/dashboard/torneos"
            signedInChildren="Ir a mis torneos"
            extraStyle="btn-primary btn-lg mt-4"
          >
            Entrar a {config.appName}
          </JoinCta>
        </div>
      }
    />
  );
}
