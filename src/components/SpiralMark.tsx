/** Espiral com pouco mais de uma volta, terminando colada no contorno (calculada uma vez). */
export const SPIRAL =
  'M45.2 48.5L45.0 48.8L44.7 49.2L44.4 49.7L44.1 50.1L43.9 50.7L43.7 51.2L43.6 51.8L43.5 52.5L43.5 53.2L43.5 53.8L43.6 54.6L43.8 55.3L44.0 56.0L44.4 56.7L44.8 57.4L45.3 58.1L45.8 58.8L46.5 59.4L47.2 59.9L48.0 60.5L48.9 60.9L49.8 61.3L50.8 61.6L51.8 61.8L52.9 62.0L54.0 62.0L55.1 61.9L56.3 61.8L57.4 61.5L58.6 61.1L59.7 60.6L60.8 59.9L61.9 59.2L63.0 58.3L63.9 57.4L64.8 56.3L65.7 55.1L66.4 53.9L67.0 52.5L67.5 51.1L67.9 49.6L68.2 48.1L68.3 46.4L68.3 44.8L68.1 43.2L67.8 41.5L67.3 39.8L66.7 38.2L65.9 36.6L65.0 35.0L63.9 33.5L62.7 32.1L61.3 30.7L59.8 29.5L58.2 28.4L56.4 27.4L54.5 26.6L52.6 25.9L50.5 25.4L48.4 25.0L46.3 24.9L44.1 24.9L41.8 25.1L39.6 25.6L37.4 26.2L35.2 27.0L33.1 28.0L31.0 29.3L29.0 30.7L27.2 32.3L25.4 34.1L23.8 36.0L22.4 38.1L21.1 40.4L20.0 42.8L19.1 45.3L18.4 47.9L18.0 50.6L17.7 53.4L17.7 56.2L18.0 59.0L18.5 61.8L19.2 64.6L20.2 67.4L21.5 70.0L23.0 72.7L24.7 75.1L26.7 77.5L28.8 79.7L31.2 81.8L33.8 83.6L36.6 85.2L39.5 86.6L42.5 87.8L45.7 88.7L49.0 89.3L52.4 89.7L55.8 89.8L59.2 89.5L62.7 89.0';

/** Símbolo do clã Uzumaki: disco vermelho, contorno e espiral pretos. */
export function SpiralMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="#e8221b" stroke="#0a0a0a" strokeWidth="7" />
      <path
        d={SPIRAL}
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
