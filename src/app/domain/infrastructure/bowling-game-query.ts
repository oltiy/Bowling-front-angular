import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';

import { BowlingGameState } from '../entities/bowling-game-state';
import { BowlingGameStore } from './bowling-game-store';

@Injectable()
export class BowlingGameQuery extends Query<BowlingGameState> {
  state$: Observable<BowlingGameState> = this.select();
  selectIsUserName$ = this.select(state => {
    return !!state.userName;
  });

  constructor(protected override readonly store: BowlingGameStore) {
    super(store);
  }
}
