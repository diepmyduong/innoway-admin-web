import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { InnowayApiService } from './innoway-api.service'
import { Router } from '@angular/router'
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    public innowayApi: InnowayApiService,
    public router: Router
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean>  {
    return this.innowayApi.innowayAuth.authenticated.then(state => {
      if(state == false) {
        this.router.navigate(['pages/login'])
      } 
      return state
    })
  }
}
