// Mini pie de página: el crédito de autoría, justo debajo de la navegación
// inferior del dashboard.
export default function FooterFoot() {
  return (
    <div className="border-t border-base-300 px-4 py-1">
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
