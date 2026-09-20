// Mini pie transversal: el crédito de autoría, al final del documento en toda
// la web (tienda, ficha, carrito, panel, la puerta de acceso...). Se monta una
// sola vez en el layout raíz.
//
// No es fijo: se ve al llegar abajo del todo. En modo demo la tarjeta flotante
// se posa justo ahí, así que globals.css le da aire para que no lo tape
// (regla `html[data-demo="true"] .footer-foot`).
//
// La tipografía es Microgramma, la de la firma: se declara en app/layout.js
// como --microgramma-font.
export default function FooterFoot() {
  return (
    <div className="footer-foot flex min-h-6 w-full items-center justify-center border-t border-white/10 bg-base-100 px-4 py-1">
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
        © {new Date().getFullYear()}
      </p>
    </div>
  );
}
