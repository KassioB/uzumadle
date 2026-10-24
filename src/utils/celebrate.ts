import confetti from 'canvas-confetti';

/** Laranja, vermelho, branco e azul-céu, em papel picado quadrado. */
const COLORS = ['#ff8c0a', '#e8221b', '#ffffff', '#2f7bff'];

/** Dispara confete dos dois cantos inferiores da tela. */
export function celebrate(): void {
  const base = {
    particleCount: 80,
    spread: 70,
    colors: COLORS,
    shapes: ['square' as const],
    disableForReducedMotion: true,
  };
  void confetti({ ...base, angle: 60, origin: { x: 0, y: 0.9 } });
  void confetti({ ...base, angle: 120, origin: { x: 1, y: 0.9 } });
}
