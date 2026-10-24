import type { KeyboardEvent } from 'react';
import type { GameMode } from '../types/game';

/*
 * Faixa do menu (Diário, Infinito, Como jogar) desenhada em SVG. Todas as medidas foram tiradas
 * da arte de referência, em pixels da imagem de 1024 px de largura, e vivem no mesmo sistema de
 * coordenadas: o polígono branco, a faixa preta, o halftone por trás e as três palavras. Assim a
 * faixa escala inteira, sem que formas e espaçamentos se desencontrem.
 */

type Point = readonly [number, number];

const INK = '#07070b';
const VIEW_BOX = '158 82 360 188';

const WHITE: readonly Point[] = [
  [198.1, 152.4],
  [498.0, 95.3],
  [466.8, 205.6],
  [167.0, 251.1],
];
const BAND: readonly Point[] = [
  [219.4, 141.3],
  [476.3, 87.2],
  [470.0, 112.5],
  [212.6, 168.9],
];

const toPoints = (polygon: readonly Point[]) => polygon.map(([x, y]) => `${x},${y}`).join(' ');

/** Tangente do ângulo (cerca de 9°) com que as três linhas sobem para a direita. */
const SKEW = 0.1571;

/** Quanto o halftone se estende para baixo e para a direita do polígono branco. */
const SHADOW_OFFSET: Point = [7, 13.5];

/**
 * Halftone atrás do polígono branco: pontos pretos numa grade em xadrez (vizinhos a cerca de 3 px), cuja
 * mancha acompanha as bordas de baixo e da direita e vai afinando para fora. Só os pontos que
 * ficam fora do polígono branco são gerados.
 */
function halftone(): string {
  const [tx, ty] = SHADOW_OFFSET;
  const edges = WHITE.map(([x1, y1], i) => {
    const [x2, y2] = WHITE[(i + 1) % WHITE.length] ?? [x1, y1];
    const length = Math.hypot(x2 - x1, y2 - y1);
    const nx = (y2 - y1) / length;
    const ny = -(x2 - x1) / length;
    return { nx, ny, offset: nx * x1 + ny * y1, push: nx * tx + ny * ty };
  });
  const xs = WHITE.map(([x]) => x);
  const ys = WHITE.map(([, y]) => y);
  const [pitchX, pitchY] = [2.25, 2];
  const round = (n: number) => Math.round(n * 100) / 100;

  let path = '';
  for (let j = Math.floor(Math.min(...ys) / pitchY); j * pitchY <= Math.max(...ys) + ty; j++) {
    for (let i = Math.floor(Math.min(...xs) / pitchX); i * pitchX <= Math.max(...xs) + tx; i++) {
      if ((i + j) % 2 !== 0) continue; // grade em xadrez: vizinhos na diagonal
      const x = round(i * pitchX);
      const y = round(j * pitchY);

      // Menor deslocamento k (0 a 1, em direção ao canto da sombra) que cobre este ponto.
      let from = 0;
      let to = Infinity;
      for (const { nx, ny, offset, push } of edges) {
        const outside = nx * x + ny * y - offset;
        if (push > 0) from = Math.max(from, outside / push);
        else if (push < 0) to = Math.min(to, outside / push);
        else if (outside > 0) to = -1;
      }
      if (from <= 0 || from > 0.98 || from > to) continue;

      const r = round(1.2 - 0.5 * from);
      path += `M${round(x - r)} ${y}a${r} ${r} 0 1 0 ${round(2 * r)} 0a${r} ${r} 0 1 0 ${round(-2 * r)} 0`;
    }
  }
  return path;
}

const HALFTONE = halftone();

interface Word {
  text: string;
  /** Origem da linha de base, no canto inferior esquerdo da primeira letra. */
  x: number;
  y: number;
  size: number;
  spacing: number;
  /** Largura extra ou a menos das letras, em relação à fonte. */
  stretch: number;
  fill: string;
  /** Espessura do contorno e deslocamento da sombra preta. */
  stroke: number;
  shadow: Point;
  /** Largura aproximada do texto, para a área clicável. */
  width: number;
}

const DIARIO: Word = {
  text: 'DIÁRIO',
  x: 232.17,
  y: 156.7,
  size: 55.2,
  spacing: 0.35,
  stretch: 1.001,
  fill: '#f7941d',
  stroke: 2.4,
  shadow: [1.8, 2.1],
  width: 214,
};
const INFINITO: Word = {
  text: 'INFINITO',
  x: 264.63,
  y: 192.43,
  size: 43.75,
  spacing: 0.1,
  stretch: 0.98,
  fill: '#ffffff',
  stroke: 1.8,
  shadow: [2.1, 3.1],
  width: 212,
};
const COMO_JOGAR: Word = {
  text: 'COMO JOGAR',
  x: 249.98,
  y: 222.49,
  size: 26.23,
  spacing: 1.3,
  stretch: 1.002,
  fill: '#e3402f',
  stroke: 1.2,
  shadow: [1.6, 2.5],
  width: 208,
};

interface MenuBannerProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onRules: () => void;
}

export function MenuBanner({ mode, onModeChange, onRules }: MenuBannerProps) {
  const items = [
    { word: DIARIO, label: 'Diário', pressed: mode === 'daily', onSelect: () => onModeChange('daily') },
    { word: INFINITO, label: 'Infinito', pressed: mode === 'infinite', onSelect: () => onModeChange('infinite') },
    { word: COMO_JOGAR, label: 'Como jogar', pressed: undefined, onSelect: onRules },
  ];

  return (
    <nav aria-label="Menu" className="menu-banner">
      <svg viewBox={VIEW_BOX} className="menu-banner__svg" focusable="false">
        <path d={HALFTONE} fill={INK} fillOpacity={0.8} />
        <polygon points={toPoints(WHITE)} fill="#fff" />
        <polygon points={toPoints(BAND)} fill={INK} />

        {items.map(({ word, label, pressed, onSelect }, i) => {
          const capHeight = word.size * 0.69;
          const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect();
            }
          };
          return (
            <g key={label} className="animate-slide" style={{ animationDelay: `${i * 70}ms` }}>
              <g
                role="button"
                tabIndex={0}
                aria-label={label}
                aria-pressed={pressed}
                className="menu-banner__item"
                onClick={onSelect}
                onKeyDown={onKeyDown}
              >
                <g transform={`matrix(${word.stretch} ${-SKEW * word.stretch} 0 1 ${word.x} ${word.y})`}>
                  <rect
                    x={-8}
                    y={-capHeight - 8}
                    width={word.width + 16}
                    height={capHeight + 18}
                    fill="transparent"
                    className="menu-banner__hit"
                  />
                  {[
                    { dx: word.shadow[0], dy: word.shadow[1], fill: INK },
                    { dx: 0, dy: 0, fill: word.fill },
                  ].map(({ dx, dy, fill }) => (
                    <text
                      key={fill}
                      x={dx}
                      y={dy}
                      aria-hidden="true"
                      className="menu-banner__word"
                      fontSize={word.size}
                      letterSpacing={word.spacing}
                      fill={fill}
                      stroke={INK}
                      strokeWidth={word.stroke}
                      strokeLinejoin="round"
                      paintOrder="stroke"
                    >
                      {word.text}
                    </text>
                  ))}
                  {pressed && word !== DIARIO && (
                    <path d={`M-16 ${-capHeight / 2 - 7}L-5 ${-capHeight / 2}L-16 ${-capHeight / 2 + 7}Z`} fill={INK} />
                  )}
                  {['menu-banner__ring menu-banner__ring--halo', 'menu-banner__ring'].map((ring) => (
                    <rect
                      key={ring}
                      x={-8}
                      y={-capHeight - 8}
                      width={word.width + 16}
                      height={capHeight + 18}
                      fill="none"
                      className={ring}
                    />
                  ))}
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </nav>
  );
}
