import type { Gender } from '../types/character';

/** Símbolos ♂ e ♀ desenhados em SVG; decorativos, porque o texto aparece ao lado. */
export function GenderIcon({ gender }: { gender: Gender }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {gender === 'Masculino' ? (
        <>
          <circle cx="10" cy="14" r="6" />
          <path d="M14.5 9.5 20 4M15 4h5v5" />
        </>
      ) : (
        <>
          <circle cx="12" cy="9" r="6" />
          <path d="M12 15v7M8.5 19h7" />
        </>
      )}
    </svg>
  );
}
