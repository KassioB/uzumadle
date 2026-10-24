import { useCallback, useState } from 'react';
import { ANSWER_POOL } from '../data/characters';
import type { Character } from '../types/character';
import { getRandomCharacter } from '../utils/gameLogic';
import { useGuesses } from './useGuesses';

export function useInfiniteGame() {
  const [target, setTarget] = useState<Character>(() => getRandomCharacter(ANSWER_POOL));
  const [guessIds, setGuessIds] = useState<string[]>([]);
  const [wins, setWins] = useState(0);

  const { guesses, guessedIds, won } = useGuesses(guessIds, target);

  const submitGuess = useCallback(
    (character: Character) => {
      if (won || guessedIds.has(character.id)) return;
      setGuessIds((ids) => [...ids, character.id]);
      if (character.id === target.id) setWins((n) => n + 1);
    },
    [won, guessedIds, target],
  );

  const nextCharacter = useCallback(() => {
    setTarget((current) => getRandomCharacter(ANSWER_POOL, current.id));
    setGuessIds([]);
  }, []);

  return { target, guesses, guessedIds, won, submitGuess, nextCharacter, wins };
}
