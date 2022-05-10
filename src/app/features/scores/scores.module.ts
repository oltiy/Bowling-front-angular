import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { DomainModule } from 'src/app/domain/domain.module';

import { ScoresComponent } from './scores.component';

const routes: Routes = [{ path: '', component: ScoresComponent }];

@NgModule({
  declarations: [ScoresComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    DomainModule,
  ],
})
export class ScoresModule {}
