import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((ob)=>{
      // console.log("AUTH",this.auth);
      var checkLogin = this.auth.loggedIn$.subscribe((authenticated)=>{
        authenticated = this.auth.authenticated;
        // console.log("AUTH SUB",authenticated);
        if(authenticated) {
          ob.next(true);
        }else if(authenticated != undefined){
          localStorage.setItem('innoway-chatbot.url.previous-state',state.url);
          this.router.navigate(['/pages/chatbot-login']);
          ob.next(false);
        }
      })
    });
  }
}

@Injectable()
export class UnAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((ob)=>{
      // console.log("UNAUTH",this.auth);
      var checkLogin = this.auth.loggedIn$.subscribe((authenticated)=>{
        authenticated = this.auth.authenticated;
        // console.log("UNAUTH SUB",authenticated);
        if(authenticated) {    
          var url = localStorage.getItem('innoway-chatbot.url.previous-state');
          if(!url || url == '/pages/chatbot-login'){
            url = '/chatbot/pages';
          }
          this.router.navigate([url]);    
          ob.next(false);      
        }else{
          ob.next(true);
        }
      })
    });
  }

}
