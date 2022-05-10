import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router';

import { FrameComponent } from '../frame/frame.component';
import { PlayComponent } from './play.component';

const routes: Routes = [{ path: '', component: PlayComponent }];

@NgModule({
  declarations: [FrameComponent, PlayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CdkTableModule,
    MatSnackBarModule,
  ],
  exports: [FrameComponent],
})
export class PlayModule {}
