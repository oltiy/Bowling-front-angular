import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { BowlingGameFacade } from 'src/app/domain/application/bowling-game-facade';
import { BowlingGameQuery } from 'src/app/domain/infrastructure/bowling-game-query';
import { DialogData, Throw } from 'src/app/shared/bowling-game.interface';
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayComponent implements OnInit, OnDestroy {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  private readonly destroy$ = new Subject<void>();
  durationInSeconds = 1;
  userName = this.query.getValue().userName;
  disableButton = true;

  maxScoreToGame = 10;
  exposeShot3?: Observable<boolean>;

  scoreShots: FormGroup = this.fb.group({
    frame: [''],
    shot1: [null],
    shot2: [null],
    shot3: [0],
    total: [0],
  });

  constructor(
    private facade: BowlingGameFacade,

    private fb: FormBuilder,
    readonly query: BowlingGameQuery,

    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.scoreShots.valueChanges
      .pipe(
        map(value => {
          if (value.shot1 != null && value.shot2 != null) {
            this.disableButton = false;
          } else {
            this.disableButton = true;
          }
          if (value.shot3 === null) {
            value.shot3 = 0;
          }
        }),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.facade
      .getCurrentGameScore()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    this.facade.state$
      .pipe(
        map(data => {
          data.bowlingThrows.map((calculate: Throw) => {
            //frames until 10
            if (calculate.frame !== 10) {
              //strike
              if (calculate.shot1 === 10 && calculate.shot2 === 0) {
                if (data.bowlingThrows[calculate.frame + 1]?.shot1 !== 10) {
                  data.bowlingThrows[calculate.frame - 1].total =
                    data.bowlingThrows[calculate.frame - 1].shot1 +
                    data.bowlingThrows[calculate.frame - 1].shot2 +
                    (data.bowlingThrows[calculate.frame]?.shot1 ?? 0) +
                    (data.bowlingThrows[calculate.frame]?.shot2 ?? 0) +
                    (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
                } else {
                  data.bowlingThrows[calculate.frame - 1].total =
                    data.bowlingThrows[calculate.frame - 1].shot1 * 2 +
                    (data.bowlingThrows[calculate.frame]?.shot1 ?? 0) +
                    (data.bowlingThrows[calculate.frame]?.shot2 ?? 0) +
                    (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
                }
              }
              // spare
              else if (calculate.shot1 + calculate.shot2 === 10) {
                data.bowlingThrows[calculate.frame - 1].total =
                  data.bowlingThrows[calculate.frame - 1].shot1 +
                  data.bowlingThrows[calculate.frame - 1].shot2 +
                  (data.bowlingThrows[calculate.frame]?.shot1 ?? 0) +
                  (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
              }
              // normal
              else {
                data.bowlingThrows[calculate.frame - 1].total =
                  data.bowlingThrows[calculate.frame - 1].shot1 +
                  data.bowlingThrows[calculate.frame - 1].shot2 +
                  (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
              }
            }
            //frame10
            else {
              if (calculate.shot1 === 10) {
                data.bowlingThrows[calculate.frame - 1].total =
                  data.bowlingThrows[calculate.frame - 1].shot1 +
                  data.bowlingThrows[calculate.frame - 1].shot2 +
                  data.bowlingThrows[calculate.frame - 1].shot3 +
                  (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
              } else if (calculate.shot2 === 10) {
                data.bowlingThrows[calculate.frame - 1].total =
                  data.bowlingThrows[calculate.frame - 1].shot1 +
                  data.bowlingThrows[calculate.frame - 1].shot2 * 2 +
                  data.bowlingThrows[calculate.frame - 1].shot3 +
                  (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
              } else if (calculate.shot3 === 10) {
                data.bowlingThrows[calculate.frame - 1].total =
                  data.bowlingThrows[calculate.frame - 1].shot1 +
                  data.bowlingThrows[calculate.frame - 1].shot2 +
                  data.bowlingThrows[calculate.frame - 1].shot3 +
                  (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
              } else {
                data.bowlingThrows[calculate.frame - 1].total =
                  data.bowlingThrows[calculate.frame - 1].shot1 +
                  data.bowlingThrows[calculate.frame - 1].shot2 +
                  data.bowlingThrows[calculate.frame - 1].shot3 +
                  (data.bowlingThrows?.[calculate.frame - 2]?.total ?? 0);
              }
              this.openDialog(data.bowlingThrows?.[9]?.total);
            }
          });
        }),
      )
      .subscribe();
    this.exposeShot3 = this.scoreShots.valueChanges.pipe(
      map((frame10: Throw) => {
        if (frame10.shot1 + frame10.shot2 >= 10) return true;
        else return false;
      }),
    );
  }

  get formControls(): Record<string, FormControl> {
    return this.scoreShots.controls as Record<string, FormControl>;
  }

  valueChanged(e: any): number {
    this.maxScoreToGame = 10 - e.target.value;
    return 10 - e.target.value;
  }

  onFormSubmit(): void {
    const shot1 = this.scoreShots.value.shot1;
    const shot2 = this.scoreShots.value.shot2;

    //Optional only tenth frame
    const shot3 = this.scoreShots.value.shot3 ?? 0;
    if (shot1 < 10 && shot1 + shot2 === 10) {
      this._snackBar.openFromComponent(SpareComponent, {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

    if (shot1 === 10) {
      this._snackBar.openFromComponent(StrikeComponent, {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

    this.scoreShots.controls['total'].setValue(shot1 + shot2 + shot3);
    this.facade.postFrameScoreGame(this.scoreShots.value).subscribe(() => {
      this.scoreShots.reset();
    });
  }

  updateTableScore(): void {
    this.facade.postTopScoreTable().subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  openDialog(totalScore: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { name: this.userName, score: totalScore },
    });
  }
}

@Component({
  selector: 'app-spare',
  templateUrl: 'spare.html',
  styles: [
    `
      .bravo {
        color: hotpink;
      }
    `,
  ],
})
export class SpareComponent {}

@Component({
  selector: 'app-spare',
  templateUrl: 'strike.html',
  styles: [
    `
      .bravo {
        color: hotpink;
      }
    `,
  ],
})
export class StrikeComponent {}

@Component({
  selector: 'app-selector',
  templateUrl: 'dialog.html',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
