import { useMemo } from 'react';
import { findCharacter } from '../data/characters';
import type { Character } from '../types/character';
import type { GuessResult } from '../types/game';
import { compareCharacters } from '../utils/gameLogic';

/** Transforma os ids chutados em resultados comparados, do mais recente para o mais antigo. */
export function useGuesses(guessIds: readonly string[], target: Character) {
  const guesses = useMemo<GuessResult[]>(
    () =>
      guessIds
        .map(findCharacter)
        .filter((c): c is Character => c !== undefined)
        .map((c) => compareCharacters(c, target))
        .reverse(),
    [guessIds, target],
  );

  const guessedIds = useMemo(() => new Set(guessIds), [guessIds]);
  const won = guesses.some((g) => g.isCorrect);

  return { guesses, guessedIds, won };
}
