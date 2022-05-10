import { Store } from '@datorama/akita';

import {
  BowlingGameState,
  bowlingGameStateInitialState,
} from '../entities/bowling-game-state';

export class BowlingGameStore extends Store<BowlingGameState> {
  constructor() {
    super(bowlingGameStateInitialState(), { name: 'bowling-game' });
  }
}
