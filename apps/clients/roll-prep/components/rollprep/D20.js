// Dado de veinte caras: el icono del CAOS. Vive aparte porque lo usan la
// ceremonia del torneo y la demo de la landing.
export default function D20({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M50 4 6 30v40l44 26 44-26V30L50 4Z" />
      <path d="M50 4 22 48l28 48 28-48L50 4Z" />
      <path d="M6 30h16M94 30H78M22 48H6M78 48h16M22 48l-16 22M78 48l16 22" />
    </svg>
  );
}
