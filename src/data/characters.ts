import type { Character } from '../types/character';
import { GENERATED_CHARACTERS } from './characters.generated';

/**
 * Personagens importados da Narutopedia por scripts/import-characters.ts,
 * do mais para o menos popular (favoritos na AniList).
 */
export const CHARACTERS: readonly Character[] = GENERATED_CHARACTERS;

/** Só os mais conhecidos podem ser a resposta; os outros servem apenas como palpite. */
const ANSWER_POOL_SIZE = 100;
export const ANSWER_POOL: readonly Character[] = CHARACTERS.slice(0, ANSWER_POOL_SIZE);

const CHARACTER_BY_ID = new Map(CHARACTERS.map((character) => [character.id, character]));

export function findCharacter(id: string): Character | undefined {
  return CHARACTER_BY_ID.get(id);
}

const NUMBER_BY_ID = new Map(CHARACTERS.map((character, i) => [character.id, i + 1]));

/** Número do ninja no registro (ordem de popularidade), com três dígitos: "#007". */
export function characterNumber(id: string): string {
  return `#${String(NUMBER_BY_ID.get(id) ?? 0).padStart(3, '0')}`;
}
