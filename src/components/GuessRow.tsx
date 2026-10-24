import type { ReactNode } from 'react';
import { characterNumber } from '../data/characters';
import type { Character } from '../types/character';
import type { AttributeFeedback, GuessResult, MatchResult } from '../types/game';
import { Avatar } from './Avatar';
import { GenderIcon } from './GenderIcon';
import { NatureIcon } from './NatureIcon';

const RESULT_STYLES: Record<MatchResult, string> = {
  correct: 'bg-hit text-ink',
  partial: 'bg-near text-ink',
  wrong: 'bg-miss text-white',
};

/** Glifo de estado no canto da célula: a cor nunca é a única pista. */
const RESULT_GLYPHS: Record<MatchResult, string> = {
  correct: '✓',
  partial: '≈',
  wrong: '✕',
};

const RESULT_LABELS: Record<MatchResult, string> = {
  correct: 'Igual',
  partial: 'Algo em comum',
  wrong: 'Nada em comum',
};

/** Intervalo entre a virada de uma célula e a próxima. */
const STAGGER_MS = 160;

/** Colunas: o ninja ocupa mais espaço que os atributos. */
export const GUESS_COLUMNS = 'grid-cols-[1.6fr_repeat(7,minmax(0,1fr))]';

interface FeedbackCellProps {
  feedback: AttributeFeedback;
  index: number;
  /** Conteúdo no lugar do texto, como os selos dos elementos. */
  children?: ReactNode;
}

/**
 * Célula de resultado. Ao passar o mouse, tocar ou focar com o teclado, vira branca com
 * a lasca vermelha e explica o resultado (e, na estreia, para que lado está o certo).
 */
function FeedbackCell({ feedback, index, children }: FeedbackCellProps) {
  const { label, result, direction } = feedback;
  const arrow = direction === 'later' ? '↑' : direction === 'earlier' ? '↓' : null;
  const explanation = [
    RESULT_LABELS[result],
    direction === 'later' && 'O certo estreou depois ↑',
    direction === 'earlier' && 'O certo estreou antes ↓',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div
      role="cell"
      tabIndex={0}
      style={{ animationDelay: `${index * STAGGER_MS}ms` }}
      className={`nd-cell animate-reveal ${RESULT_STYLES[result]}`}
    >
      <span aria-hidden="true" className="nd-cell__glyph">
        {RESULT_GLYPHS[result]}
      </span>
      <span className="nd-cell__body flex flex-col items-center gap-1">
        {arrow && (
          <span aria-hidden="true" className="text-2xl leading-none font-black">
            {arrow}
          </span>
        )}
        {children ?? label}
      </span>
      <span aria-hidden="true" className="nd-cell__tip">
        <span>{explanation}</span>
      </span>
      <span className="sr-only">. {explanation.replace(/[↑↓]/g, '')}</span>
    </div>
  );
}

/** Uma faixa inclinada por palpite. */
export function GuessRow({ guess, index }: { guess: GuessResult; index: number }) {
  const { character } = guess;
  return (
    <div
      role="row"
      style={{ marginLeft: `${Math.min(index, 4) * 8}px` }}
      className={`grid ${GUESS_COLUMNS} -skew-x-12 gap-[3px] border-y-2 border-ink bg-ink`}
    >
      <div role="rowheader" className="flex items-center gap-3 bg-white px-4 py-2">
        <span className="flex skew-x-12 items-center gap-3">
          <Avatar character={character} />
          <span className="min-w-0">
            <span className="block text-xs font-black text-scarlet italic">{characterNumber(character.id)}</span>
            <span className="block text-sm leading-tight font-black text-ink uppercase italic">
              {character.name}
            </span>
          </span>
        </span>
      </div>
      {guess.feedback.map((feedback, i) => (
        <FeedbackCell key={feedback.key} feedback={feedback} index={i}>
          {cellContent(feedback, character)}
        </FeedbackCell>
      ))}
    </div>
  );
}

/** Gênero ganha o símbolo ♂/♀ e elemento vira selos; o resto fica só com o texto. */
function cellContent({ key }: AttributeFeedback, character: Character): ReactNode {
  if (key === 'gender') {
    return (
      <span className="flex flex-col items-center gap-0.5">
        <GenderIcon gender={character.gender} />
        {character.gender}
      </span>
    );
  }
  if (key === 'natures' && character.natures.length > 0) {
    return (
      <span className="flex flex-wrap justify-center gap-1">
        {character.natures.map((nature) => (
          <NatureIcon key={nature} nature={nature} />
        ))}
      </span>
    );
  }
  return undefined;
}
