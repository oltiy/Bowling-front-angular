import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BowlingGameFacade } from './application/bowling-game-facade';
import { BowlingGameQuery } from './infrastructure/bowling-game-query';
import { BowlingGameStore } from './infrastructure/bowling-game-store';
import { BowlingGameService } from './infrastructure/bowling-game.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    BowlingGameStore,
    BowlingGameQuery,
    BowlingGameFacade,
    BowlingGameService,
  ],
})
export class DomainModule {}
