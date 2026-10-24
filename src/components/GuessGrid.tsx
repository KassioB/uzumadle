import type { GuessResult } from '../types/game';
import { GUESS_COLUMNS, GuessRow } from './GuessRow';
import { Legend } from './Legend';

const COLUMNS = ['Ninja', 'Gênero', 'Afiliação', 'Clã', 'Elemento', 'Estreia', 'Atributos', 'Tipo de jutsu'];

/** Palpites em faixas inclinadas e escalonadas, uma por ninja. */
export function GuessGrid({ guesses }: { guesses: readonly GuessResult[] }) {
  if (guesses.length === 0) return null;

  return (
    <section aria-labelledby="palpites" className="flex flex-col gap-4">
      <h2 id="palpites" className="mm-title -rotate-2">
        Palpites
        <span className="mm-title__count">{String(guesses.length).padStart(2, '0')}</span>
      </h2>
      {/* No celular a lista rola na horizontal em vez de espremer as células. */}
      <div className="-mx-4 overflow-x-auto px-6 pb-2 sm:-mx-6 sm:px-8">
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
