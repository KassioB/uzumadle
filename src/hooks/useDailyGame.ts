import { useCallback, useEffect, useMemo, useState } from 'react';
import { ANSWER_POOL } from '../data/characters';
import type { Character } from '../types/character';
import type { DailySave } from '../types/game';
import { getDailyCharacter, getDateKey, msUntilNextDay } from '../utils/gameLogic';
import { loadJSON, saveJSON } from '../utils/storage';
import { useGuesses } from './useGuesses';

interface StreakSave {
  streak: number;
  lastWinDate: string;
}

const isDailySave = (v: unknown): v is DailySave =>
  typeof v === 'object' &&
  v !== null &&
  typeof (v as DailySave).dateKey === 'string' &&
  Array.isArray((v as DailySave).guessIds) &&
  (v as DailySave).guessIds.every((id) => typeof id === 'string');

const isStreakSave = (v: unknown): v is StreakSave =>
  typeof v === 'object' &&
  v !== null &&
  typeof (v as StreakSave).streak === 'number' &&
  typeof (v as StreakSave).lastWinDate === 'string';

function loadGuessesFor(dateKey: string): string[] {
  const save = loadJSON('daily', isDailySave);
  return save?.dateKey === dateKey ? save.guessIds : [];
}

function yesterdayKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number) as [number, number, number];
  return getDateKey(new Date(y, m - 1, d - 1));
}

export function useDailyGame() {
  const [dateKey, setDateKey] = useState(getDateKey);
  const [guessIds, setGuessIds] = useState(() => loadGuessesFor(dateKey));
  const [streak, setStreak] = useState(() => loadJSON('streak', isStreakSave));

  const target = useMemo<Character>(() => {
    const [y, m, d] = dateKey.split('-').map(Number) as [number, number, number];
    return getDailyCharacter(ANSWER_POOL, new Date(y, m - 1, d));
  }, [dateKey]);

  const yesterday = useMemo<Character>(() => {
    const [y, m, d] = dateKey.split('-').map(Number) as [number, number, number];
    return getDailyCharacter(ANSWER_POOL, new Date(y, m - 1, d - 1));
  }, [dateKey]);

  const { guesses, guessedIds, won } = useGuesses(guessIds, target);

  // Vira o dia sozinho se a aba ficar aberta depois da meia-noite.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = getDateKey();
      setDateKey(next);
      setGuessIds(loadGuessesFor(next));
    }, msUntilNextDay() + 500);
    return () => window.clearTimeout(timer);
  }, [dateKey]);

  useEffect(() => {
    saveJSON('daily', { dateKey, guessIds } satisfies DailySave);
  }, [dateKey, guessIds]);

  const submitGuess = useCallback(
    (character: Character) => {
      if (won || guessedIds.has(character.id)) return;
      setGuessIds((ids) => [...ids, character.id]);

      if (character.id === target.id) {
        setStreak((prev) => {
          const continues = prev?.lastWinDate === yesterdayKey(dateKey);
          const next: StreakSave = {
            streak: continues ? prev.streak + 1 : 1,
            lastWinDate: dateKey,
          };
          saveJSON('streak', next);
          return next;
        });
      }
    },
    [won, guessedIds, target, dateKey],
  );

  // A sequência só vale se a última vitória foi hoje ou ontem.
  const currentStreak =
    streak && (streak.lastWinDate === dateKey || streak.lastWinDate === yesterdayKey(dateKey))
      ? streak.streak
      : 0;

  return { target, yesterday, guesses, guessedIds, won, submitGuess, streak: currentStreak };
}
