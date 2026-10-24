import type { ChakraNature } from '../types/character';

/** Kanji de cada natureza, como aparecem na série, e a cor do glifo. */
const NATURES: Record<ChakraNature, { kanji: string; color: string }> = {
  Fogo: { kanji: '火', color: 'text-[#c8102e]' },
  Vento: { kanji: '風', color: 'text-[#2f855a]' },
  Raio: { kanji: '雷', color: 'text-[#9a6f00]' },
  Terra: { kanji: '土', color: 'text-[#7a4f2a]' },
  Água: { kanji: '水', color: 'text-[#2b6cb0]' },
};

/**
 * Selo quadrado com o kanji do elemento, no estilo dos glifos de elemento do céu de anime.
 * O nome vai no texto alternativo (leitores de tela) e no title, que aparece ao passar o mouse.
 */
export function NatureIcon({ nature }: { nature: ChakraNature }) {
  const { kanji, color } = NATURES[nature];
  return (
    <span
      role="img"
      aria-label={nature}
      title={nature}
      className={`inline-flex size-7 items-center justify-center border-2 border-[#16130d] bg-[#f2ede1] text-sm leading-none font-bold ${color}`}
    >
      <span aria-hidden="true">{kanji}</span>
    </span>
  );
}
