import type { GameMode } from '../types/game';
import { MenuBanner } from './MenuBanner';

interface HeroProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onRules: () => void;
}

/** Abertura: a faixa com o menu (Diário, Infinito, Como jogar), à esquerda. */
export function Hero({ mode, onModeChange, onRules }: HeroProps) {
  return (
    <section className="relative flex justify-start pt-6 pb-4">
      <MenuBanner mode={mode} onModeChange={onModeChange} onRules={onRules} />
    </section>
  );
}
