import type { Character } from './character';

export type GameMode = 'daily' | 'infinite';

export type MatchResult = 'correct' | 'partial' | 'wrong';

/** Para onde está a resposta em relação ao chute: depois (later) ou antes (earlier). */
export type Direction = 'later' | 'earlier';

export type AttributeKey = 'gender' | 'affiliations' | 'clan' | 'natures' | 'debut' | 'abilities' | 'jutsuTypes';

export interface AttributeFeedback {
  key: AttributeKey;
  /** Texto exibido na célula; listas vêm com um item por linha. */
  label: string;
  result: MatchResult;
  direction?: Direction;
}

export interface GuessResult {
  character: Character;
  feedback: readonly AttributeFeedback[];
  isCorrect: boolean;
}

/** O que fica salvo no localStorage para o modo diário. */
export interface DailySave {
  dateKey: string;
  guessIds: string[];
}
