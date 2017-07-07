import { NgModule } from '@angular/core';

import { p404Component } from './404.component';
import { p500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ChatbotLoginComponent } from './chatbot-login.component';

import { ChatbotModule } from '../chatbot/chatbot.module'

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [ PagesRoutingModule],
  declarations: [
    p404Component,
    p500Component,
    LoginComponent,
    RegisterComponent,
    ChatbotLoginComponent
  ],
  // providers: [ChatbotAuthService,UnAuthGuard]
})
export class PagesModule { }
