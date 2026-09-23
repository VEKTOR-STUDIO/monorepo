// Mini pie transversal: el crédito de autoría, al final del documento en toda
// la web (portada, acceso, panel...). Se monta una sola vez en el layout raíz.
//
// La tipografía es Microgramma, la de la firma de Vektor: se declara en
// app/layout.js como --microgramma-font.
export default function FooterFoot() {
  return (
    <div className="footer-foot flex min-h-6 w-full items-center justify-center border-t border-base-content/10 bg-base-100 px-4 py-1">
      <p className="text-center text-[0.55rem] font-semibold text-base-content/50">
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
