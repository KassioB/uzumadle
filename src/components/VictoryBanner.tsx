import { characterNumber } from '../data/characters';
import type { Character } from '../types/character';
import { Avatar } from './Avatar';
import { Countdown } from './Countdown';

interface VictoryBannerProps {
  character: Character;
  attempts: number;
  /** Só no modo infinito. Sem ele, mostra a contagem para o próximo dia. */
  onNext?: () => void;
}

/** Ficha do ninja descoberto: caixa branca com o título "Missão cumprida" por cima da borda. */
export function VictoryBanner({ character, attempts, onNext }: VictoryBannerProps) {
  return (
    <section aria-live="polite" className="relative animate-reveal pt-9">
      <p className="mm-display nd-outline absolute top-0 left-3 z-10 -rotate-3 text-[clamp(2.25rem,6vw,3.75rem)]">
        <span className="relative inline-block text-scarlet">
          <span className="absolute inset-x-[-0.1em] top-[40%] -z-10 h-[50%] -skew-x-[20deg] bg-ink/80" />
          Missão
        </span>{' '}
        <span className="text-orange">cumprida</span>
      </p>
      <div className="mm-box px-5 pt-9 pb-6 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar character={character} size="lg" />
          <div className="flex-1">
            <p className="text-sm font-black text-scarlet italic">{characterNumber(character.id)}</p>
            <p className="mm-display relative inline-block text-3xl text-ink sm:text-4xl">
              <span className="absolute inset-x-[-0.15em] top-[52%] -z-10 h-[40%] -skew-x-[20deg] bg-scarlet" />
              {character.name}
            </p>
            <p className="mt-2 text-sm text-steel">
              Descoberto em {String(attempts).padStart(2, '0')}{' '}
              {attempts === 1 ? 'tentativa' : 'tentativas'}.
            </p>
          </div>
          {onNext ? (
            <button type="button" onClick={onNext} autoFocus className="mm-btn mm-btn--primary px-8 py-3 text-lg">
              <span>Próximo ninja ▸</span>
            </button>
          ) : (
            <div className="sm:text-right">
              <p className="mm-label">Próximo ninja em</p>
              <Countdown />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
