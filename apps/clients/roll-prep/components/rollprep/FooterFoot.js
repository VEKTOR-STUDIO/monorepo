// Mini pie de página transversal: el crédito de autoría, al final del
// documento en toda la web (landing, dashboard, blog, legales...). Se monta
// una sola vez en el layout raíz.
//
// No es fijo: se ve al llegar abajo del todo. En el dashboard, donde la
// navegación inferior sí es fija, globals.css le da aire de sobra para que
// no lo tape (regla `body:has(.bottom-nav) .footer-foot`).
export default function FooterFoot() {
  return (
    <div className="footer-foot flex min-h-6 w-full items-center justify-center border-t border-base-300 bg-base-100 px-4 py-1">
      <p className="text-center text-[0.55rem] font-semibold text-base-content/50">
        Hecho por{" "}
        <a
          href="https://alessandrovaru.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover uppercase transition-colors hover:text-accent"
          style={{
            fontFamily: "var(--microgramma-font)",
            letterSpacing: "0.1em",
          }}
        >
          Alessandrovaru
        </a>{" "}
        © {new Date().getFullYear()}
      </p>
    </div>
  );
}
