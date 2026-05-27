export default function FooterFoot() {
  return (
    <div className="bg-base-100 border-t border-base-content/10 fixed bottom-0 left-0 right-0 z-50 py-2 px-4">
      <p className="text-xs md:text-sm text-base-content/80 text-center">
        Hecho por{" "}
        <a 
          href="https://alessandrovaru.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover transition-colors hover:text-accent uppercase"
          style={{ fontFamily: 'var(--microgramma-font)' }}
        >
          Alessandrovaru
        </a> © {new Date().getFullYear()} 
      </p>
    </div>
  );
}