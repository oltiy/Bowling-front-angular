import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BowlingGameFacade } from 'src/app/domain/application/bowling-game-facade';
import { BowlingGameQuery } from 'src/app/domain/infrastructure/bowling-game-query';
@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoresComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'max'];
  private readonly destroy$ = new Subject<void>();
  constructor(
    readonly query: BowlingGameQuery,

    readonly facade: BowlingGameFacade,
  ) {}

  ngOnInit(): void {
    this.facade.getTopScores().pipe(takeUntil(this.destroy$)).subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
