import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public auth:AuthService,
    public router: Router,
  ){
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>(sub =>{
      this.auth.getAuthState().then(obState =>{
        obState.subscribe(state =>{
          if(state){
            
          }else{
            this.router.navigate(['/login'])
          }
          sub.next(state);
        })
      })
    })
  }
}
