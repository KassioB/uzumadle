import { getArc } from '../data/arcs';
import type { Character } from '../types/character';
import type { AttributeFeedback, GuessResult, MatchResult } from '../types/game';

const MS_PER_DAY = 86_400_000;

// ---------- Datas e sementes ----------

/** Chave do dia no fuso local, no formato AAAA-MM-DD. */
export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Número de dias desde 01/01/1970 para a data local (ignora o horário). */
function getDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);
}

/** Dia do lançamento do jogo (24/10/2026); o "DIA #1". */
const FIRST_DAY = Date.UTC(2026, 9, 24);

/** Número do jogo diário para a data (1 no primeiro dia). */
export function getGameNumber(date: Date = new Date()): number {
  return getDayNumber(date) - FIRST_DAY / MS_PER_DAY + 1;
}

/** Milissegundos até a próxima meia-noite local. */
export function msUntilNextDay(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** Gerador pseudoaleatório determinístico (mulberry32): mesma semente, mesma sequência. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const random = mulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

// ---------- Seleção de personagens ----------

/**
 * Personagem do dia. A lista é embaralhada com uma semente por "ciclo" de N dias
 * (N = tamanho da lista), então ninguém se repete até todos terem saído.
 */
export function getDailyCharacter(pool: readonly Character[], date: Date = new Date()): Character {
  if (pool.length === 0) throw new Error('A lista de personagens está vazia.');
  const day = getDayNumber(date);
  const cycle = Math.floor(day / pool.length);
  const order = seededShuffle(pool, cycle + 0x9e3779b9);
  return order[day % pool.length] as Character;
}

/** Sorteio do modo infinito, evitando repetir o personagem anterior. */
export function getRandomCharacter(pool: readonly Character[], excludeId?: string): Character {
  const candidates = pool.length > 1 ? pool.filter((c) => c.id !== excludeId) : pool;
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  if (!picked) throw new Error('A lista de personagens está vazia.');
  return picked;
}

// ---------- Comparação de atributos ----------

function compareExact<T>(guess: T, target: T): MatchResult {
  return guess === target ? 'correct' : 'wrong';
}

/** Verde se os conjuntos são iguais, amarelo se têm algo em comum, vermelho se não. */
function compareSets<T>(guess: readonly T[], target: readonly T[]): MatchResult {
  const targetSet = new Set(target);
  const sameSize = new Set(guess).size === targetSet.size;
  if (sameSize && guess.every((item) => targetSet.has(item))) return 'correct';
  return guess.some((item) => targetSet.has(item)) ? 'partial' : 'wrong';
}

function listLabel(items: readonly string[], empty = 'Nenhum'): string {
  return items.length > 0 ? items.join('\n') : empty;
}

function compareDebut(guess: Character, target: Character): AttributeFeedback {
  const guessArc = getArc(guess.debutArcId);
  const targetArc = getArc(target.debutArcId);
  const label = `${guessArc.name} (${guessArc.series})`;

  if (guessArc.id === targetArc.id) return { key: 'debut', label, result: 'correct' };

  // Arco não tem meio-termo: ou é o mesmo, ou a seta mostra para que lado está o certo.
  return {
    key: 'debut',
    label,
    result: 'wrong',
    direction: targetArc.chapters[0] > guessArc.chapters[0] ? 'later' : 'earlier',
  };
}

export function compareCharacters(guess: Character, target: Character): GuessResult {
  const feedback: AttributeFeedback[] = [
    { key: 'gender', label: guess.gender, result: compareExact(guess.gender, target.gender) },
    {
      key: 'affiliations',
      label: listLabel(guess.affiliations),
      result: compareSets(guess.affiliations, target.affiliations),
    },
    { key: 'clan', label: guess.clan, result: compareExact(guess.clan, target.clan) },
    {
      key: 'natures',
      label: listLabel(guess.natures),
      result: compareSets(guess.natures, target.natures),
    },
    compareDebut(guess, target),
    {
      key: 'abilities',
      label: listLabel(guess.abilities, 'Nenhuma'),
      result: compareSets(guess.abilities, target.abilities),
    },
    {
      key: 'jutsuTypes',
      label: listLabel(guess.jutsuTypes, 'Nenhum'),
      result: compareSets(guess.jutsuTypes, target.jutsuTypes),
    },
  ];

  return { character: guess, feedback, isCorrect: guess.id === target.id };
}

// ---------- Busca ----------

/** Remove acentos e caixa para a busca aceitar "hyuga" e "Hyūga", por exemplo. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
