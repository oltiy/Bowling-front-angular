import { Throw, TopScoreTable } from 'src/app/shared/bowling-game.interface';

export interface BowlingGameState {
  userName: string;
  bowlingThrows: Throw[];
  topScoresTable: TopScoreTable[];
}

export function bowlingGameStateInitialState(): BowlingGameState {
  return {
    userName: '',
    bowlingThrows: [],
    topScoresTable: [],
  };
}
