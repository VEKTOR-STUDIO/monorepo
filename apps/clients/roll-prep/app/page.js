import Link from "next/link";
import ButtonSignin from "@/components/ButtonSignin";
import config from "@/config";

export default function Page() {
  return (
    <>
      <header className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <span className="text-lg font-extrabold">{config.appName} 🥋</span>
        <ButtonSignin text="Entrar" extraStyle="btn-primary" />
      </header>

      <main>
        <section className="flex flex-col items-center justify-center gap-8 px-8 py-24 text-center">
          <h1 className="max-w-2xl text-4xl font-extrabold md:text-5xl">
            El estudio no termina cuando sales del tatami
          </h1>

          <p className="max-w-xl text-lg opacity-80">
            RollPrep conecta a la clase de Jiu-Jitsu entre entrenos: de martes a
            jueves estudias el video asignado por el profesor, y de jueves a
            martes votas el tema de la próxima clase.
          </p>

          <div className="grid max-w-2xl gap-4 text-left md:grid-cols-3">
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body p-5">
                <p className="text-2xl">📋</p>
                <h2 className="font-bold">Tarea semanal</h2>
                <p className="text-sm opacity-70">
                  Un video para llegar preparado a la clase del jueves.
                </p>
              </div>
            </div>
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body p-5">
                <p className="text-2xl">🗳️</p>
                <h2 className="font-bold">Tú eliges el tema</h2>
                <p className="text-sm opacity-70">
                  Vota entre 3 opciones qué se estudia la próxima semana.
                </p>
              </div>
            </div>
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body p-5">
                <p className="text-2xl">📚</p>
                <h2 className="font-bold">Videoteca</h2>
                <p className="text-sm opacity-70">
                  El archivo histórico de todo lo estudiado, clase por clase.
                </p>
              </div>
            </div>
          </div>

          <Link href="/signin" className="btn btn-primary btn-lg">
            Empezar a entrenar 🥋
          </Link>
        </section>
      </main>
    </>
  );
}
