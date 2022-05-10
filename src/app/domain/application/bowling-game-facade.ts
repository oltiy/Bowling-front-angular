import { Injectable } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Throw } from 'src/app/shared/bowling-game.interface';

import { BowlingGameQuery } from '../infrastructure/bowling-game-query';
import { BowlingGameStore } from '../infrastructure/bowling-game-store';
import { BowlingGameService } from '../infrastructure/bowling-game.service';

@Injectable()
export class BowlingGameFacade {
  state$ = this.query.state$;
  constructor(
    private query: BowlingGameQuery,
    private store: BowlingGameStore,
    private service: BowlingGameService,
  ) {}

  getCurrentGameScore(): Observable<void> {
    return this.service.getCurrentGameScore().pipe(
      map(currentGameScore => {
        this.store.update({
          bowlingThrows: currentGameScore,
        });
      }),
    );
  }

  getTopScores(): Observable<void> {
    return this.service.getTopScores().pipe(
      map(topScores => {
        const fiveTop = topScores
          .sort((a, b) => {
            return a.max > b.max ? -1 : 1;
          })
          .slice(0, 5);

        this.store.update({
          topScoresTable: fiveTop,
        });
      }),
    );
  }

  setUserName(userName: string): void {
    return this.store.update({ userName: userName });
  }

  postFrameScoreGame(shot: Throw): Observable<Throw> {
    const org = shot;
    return this.service.postFrameScoreGame(shot).pipe(
      tap(() => {
        const bowlingThrows = this.query.getValue().bowlingThrows;
        org.frame = bowlingThrows.length + 1;
        this.store.update({ bowlingThrows: [...bowlingThrows, org] });
      }),
    );
  }

  postTopScoreTable(): Observable<void> {
    const name = this.query.getValue().userName;
    const score = this.query.getValue().bowlingThrows;
    const max = score[9].total;
    const topScoresTable = this.query.getValue().topScoresTable;
    return this.service.cleanTableGame().pipe(
      switchMap(() => {
        return this.service.postTableScore({ name, game: score, max }).pipe(
          map(() =>
            this.store.update({
              bowlingThrows: [],
              topScoresTable: [...topScoresTable, { name, game: [score], max }],
            }),
          ),
        );
      }),
    );
  }
}
