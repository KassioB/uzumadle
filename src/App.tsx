import { useState } from 'react';
import { Avatar } from './components/Avatar';
import { Card } from './components/Card';
import { CharacterInput } from './components/CharacterInput';
import { DevCredit } from './components/DevCredit';
import { GuessGrid } from './components/GuessGrid';
import { Hero } from './components/Hero';
import { HowToPlay } from './components/HowToPlay';
import { Navbar } from './components/Navbar';
import { VictoryBanner } from './components/VictoryBanner';
import { CHARACTERS, characterNumber } from './data/characters';
import { useDailyGame } from './hooks/useDailyGame';
import { useInfiniteGame } from './hooks/useInfiniteGame';
import type { Character } from './types/character';
import type { GameMode } from './types/game';
import { celebrate } from './utils/celebrate';
import { getGameNumber } from './utils/gameLogic';
import { loadJSON, saveJSON } from './utils/storage';

const isGameMode = (v: unknown): v is GameMode => v === 'daily' || v === 'infinite';

/** "23 out 2026", para a caixinha de data do topo. */
function shortDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(date)
    .replace(/ de /g, ' ')
    .replace('.', '');
}

export default function App() {
  const [mode, setMode] = useState<GameMode>(() => loadJSON('mode', isGameMode) ?? 'daily');
  const [rulesOpen, setRulesOpen] = useState(false);
  // Os dois modos ficam vivos ao mesmo tempo, então trocar de aba não perde o progresso.
  const daily = useDailyGame();
  const infinite = useInfiniteGame();
  const game = mode === 'daily' ? daily : infinite;

  function changeMode(next: GameMode) {
    setMode(next);
    saveJSON('mode', next);
  }

  function handleGuess(character: Character) {
    if (character.id === game.target.id && !game.won) celebrate();
    game.submitGuess(character);
  }

  return (
    <div className="flex min-h-dvh flex-col text-white">
      <Navbar
        dayLabel={mode === 'daily' ? `Dia #${String(getGameNumber()).padStart(3, '0')}` : 'Treino livre'}
        dayCaption={mode === 'daily' ? shortDate(new Date()) : 'quantos quiser'}
      />

      <main id="topo" className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pb-16 sm:px-6">
        <Hero mode={mode} onModeChange={changeMode} onRules={() => setRulesOpen(true)} />

        {game.won ? (
          <VictoryBanner
            character={game.target}
            attempts={game.guesses.length}
            {...(mode === 'infinite' && { onNext: infinite.nextCharacter })}
          />
        ) : (
          <Card aria-labelledby="buscar" className="z-30 w-full max-w-[640px]">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <h2
                id="buscar"
                className="mm-display nd-outline relative isolate -rotate-3 text-[clamp(2.25rem,6vw,3.25rem)] text-orange"
              >
                <span aria-hidden="true" className="absolute inset-x-[-0.15em] top-[38%] -z-10 h-[58%] -skew-x-[20deg] bg-scarlet" />
                Palpite
              </h2>
            </div>
            <div className="mt-4">
              <CharacterInput
                id="busca-ninja"
                characters={CHARACTERS}
                excludedIds={game.guessedIds}
                onSelect={handleGuess}
              />
            </div>
          </Card>
        )}

        <GuessGrid guesses={game.guesses} />

        {/* No dia do lançamento não existe "ontem". */}
        {mode === 'daily' && getGameNumber() > 1 && (
          <p className="mm-row ml-auto w-fit max-w-full">
            <span className="mm-label">Ontem</span>
            <Avatar character={daily.yesterday} size="sm" />
            <span className="text-sm font-black text-scarlet italic">{characterNumber(daily.yesterday.id)}</span>
            <span className="text-base font-black uppercase italic">{daily.yesterday.name}</span>
          </p>
        )}
      </main>

      <footer className="mt-auto border-t-2 border-orange bg-ink/85">
        {/* Uma linha só no desktop; no celular quebra em duas. */}
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-2.5 text-center sm:px-6 lg:flex-nowrap lg:justify-between lg:py-2 lg:text-left">
          <p className="mm-label text-[10px]! normal-case lg:whitespace-nowrap">
            {CHARACTERS.length} ninjas até Shippuden · Dados:{' '}
            <a href="https://naruto.fandom.com" target="_blank" rel="noreferrer" className="text-white underline hover:text-orange">
              Narutopedia
            </a>{' '}
            (CC BY-SA) · Fotos:{' '}
            <a href="https://anilist.co" target="_blank" rel="noreferrer" className="text-white underline hover:text-orange">
              AniList
            </a>{' '}
            · Naruto © Masashi Kishimoto
          </p>
          <DevCredit />
        </div>
      </footer>

      <HowToPlay open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
