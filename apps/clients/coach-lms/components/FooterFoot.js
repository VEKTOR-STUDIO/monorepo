// Mini pie con el crédito de autoría. Va al pie de la pantalla de acceso
// (app/signin/page.js), fijo abajo del todo.
//
// La tipografía es Microgramma, la de la firma de Vektor: se declara en
// app/layout.js como --microgramma-font.
export default function FooterFoot() {
  return (
    <div className="bg-base-100 border-t border-base-300 fixed bottom-0 left-0 right-0 z-50 py-2 px-4 shadow-sm">
      <p className="text-xs md:text-sm text-base-content/80 text-center">
        Hecho por{" "}
        <a
          href="https://alessandrovaru.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover uppercase transition-colors hover:text-primary"
          style={{
            fontFamily: "var(--microgramma-font)",
            letterSpacing: "0.1em",
          }}
        >
          Alessandrovaru
        </a>{" "}
        de{" "}
        <a
          href="https://vektorstudio.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover uppercase transition-colors hover:text-primary"
          style={{
            fontFamily: "var(--microgramma-font)",
            letterSpacing: "0.1em",
          }}
        >
          Vektor
        </a>{" "}
        © {new Date().getFullYear()}
      </p>
    </div>
  );
}
