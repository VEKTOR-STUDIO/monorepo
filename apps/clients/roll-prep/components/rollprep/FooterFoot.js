// Mini pie de página transversal: el crédito de autoría, fijo abajo del todo
// en toda la web (landing, dashboard, blog, legales...). Se monta una sola
// vez en el layout raíz; la navegación inferior del dashboard se apoya
// justo encima (BottomNav va en `bottom-6`, la altura de esta barra).
export default function FooterFoot() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex h-6 items-center justify-center border-t border-base-300 bg-base-100/95 px-4 backdrop-blur">
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
