import { Component } from '@angular/core';
import { AuthService } from 'app/apps/chatbot/services/auth.service';
import { Router} from '@angular/router';
@Component({
  templateUrl: 'chatbot-login.component.html'
})
export class ChatbotLoginComponent {

  constructor(
    public auth: AuthService,
    public router: Router
  ) { 
  }

  login(){
    this.auth.loginWithFacebook().then((res)=>{
      console.log("LOGIN SUCCESS ",res);
      this.router.navigate(['/chatbot/pages']);
    });
  }

}
