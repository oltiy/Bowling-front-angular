import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BowlingGameQuery } from './domain/infrastructure/bowling-game-query';

@Injectable({
  providedIn: 'root',
})
export class UserNameGuard implements CanActivate {
  constructor(private router: Router, private query: BowlingGameQuery) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.query.selectIsUserName$.pipe(
      tap(isUserName$ => {
        if (!isUserName$) {
          this.router.navigateByUrl('/welcome');
        }
      }),
    );
  }
}
