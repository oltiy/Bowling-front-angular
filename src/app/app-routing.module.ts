import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserNameGuard } from './user-name.guard';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: (): Promise<unknown> =>
      import('./features/welcome/welcome.module').then(m => m.WelcomeModule),
  },

  {
    path: 'play',
    loadChildren: (): Promise<unknown> =>
      import('./features/play/play.module').then(m => m.PlayModule),
    canActivate: [UserNameGuard],
  },
  {
    path: 'scores',
    loadChildren: (): Promise<unknown> =>
      import('./features/scores/scores.module').then(m => m.ScoresModule),
    canActivate: [UserNameGuard],
  },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
