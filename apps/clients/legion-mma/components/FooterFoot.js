export default function FooterFoot() {
  return (
    <div className="bg-base-100 border-t border-base-content/10 fixed bottom-0 left-0 right-0 z-50 py-2 px-4">
      <p className="text-xs md:text-sm text-base-content/80 text-center">
        Desarrollado por{" "}
        <a
          href="https://wadoom.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover transition-colors hover:text-accent uppercase tracking-widest"
        >
          WADOOM
        </a>{" "}
        © {new Date().getFullYear()}
      </p>
    </div>
  );
}
