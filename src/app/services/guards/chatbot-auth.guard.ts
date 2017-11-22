import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ChatbotAuthService } from '../chatbot/chatbot-auth.service'

@Injectable()
export class ChatbotAuthGuard implements CanActivate {
  constructor(
    public auth: ChatbotAuthService,
    public router: Router
  ) {

  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    console.log('Chat bot Auth Guard....')
    return new Promise<boolean>((resolve, reject) => {
      this.auth.onAuthStateChange.subscribe(state => {
        if (state === undefined) {
          this.auth.getAppState()
        } else if (state) {
          resolve(true)
        } else {
          this.router.navigate(["login"])
          resolve(false)
        }
        
      })
    })
  }
}
