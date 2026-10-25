import type { GuessResult } from '../types/game';
import { ATTRIBUTE_LABELS, GUESS_COLUMNS, GuessCard, GuessRow } from './GuessRow';
import { Legend } from './Legend';

const COLUMNS = ['Ninja', ...Object.values(ATTRIBUTE_LABELS)];

/**
 * Palpites. No computador, faixas inclinadas e escalonadas numa tabela; no celular, um cartão
 * por ninja, para não precisar rolar para os lados.
 */
export function GuessGrid({ guesses }: { guesses: readonly GuessResult[] }) {
  if (guesses.length === 0) return null;

  return (
    <section aria-labelledby="palpites" className="flex flex-col gap-4">
      <h2 id="palpites" className="mm-title -rotate-2">
        Palpites
        <span className="mm-title__count">{String(guesses.length).padStart(2, '0')}</span>
      </h2>

      <ol aria-label="Seus palpites" className="flex flex-col gap-4 px-2 md:hidden">
        {guesses.map((guess) => (
          <GuessCard key={guess.character.id} guess={guess} />
        ))}
      </ol>

      <div className="-mx-4 hidden overflow-x-auto px-6 pb-2 sm:-mx-6 sm:px-8 md:block">
        <div role="table" aria-label="Seus palpites" className="flex min-w-[940px] flex-col gap-2">
          <div role="row" className={`grid ${GUESS_COLUMNS} -skew-x-12 gap-[3px]`}>
            {COLUMNS.map((column) => (
              <div
                key={column}
                role="columnheader"
                className="bg-ink py-1 text-center text-[11px] font-black tracking-[0.06em] text-white uppercase italic"
              >
                <span className="inline-block skew-x-12">{column}</span>
              </div>
            ))}
          </div>
          <div role="rowgroup" className="flex flex-col gap-2">
            {guesses.map((guess, index) => (
              <GuessRow key={guess.character.id} guess={guess} index={index} />
            ))}
          </div>
        </div>
      </div>
      <Legend />
    </section>
  );
}
