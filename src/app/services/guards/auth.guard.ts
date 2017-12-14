import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InnowayAuthService } from 'app/services/innoway'
import * as Console from 'console-prefix'
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public innowayAuth: InnowayAuthService,
    public router: Router
  ) {
    this.log('On Auth Guard')
  }

  get log() { return Console(`[Auth Guard]`).log }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.log('state', state)
    return this.innowayAuth.authenticated.then(state => {
      this.log('auth state', state)
      if (state == false) {
        this.router.navigate(['/login'])
      } else if (!this.innowayAuth.firebaseUser.emailVerified) {
        this.innowayAuth.logout()
      }
      return state
    })
  }
}
