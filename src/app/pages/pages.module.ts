import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'
import { CustomFormsModule } from 'ng2-validation'

import { p404Component } from './404.component';
import { p500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ChatbotLoginComponent } from './chatbot-login.component';

import { ChatbotModule } from '../apps/chatbot/chatbot.module'

import { PagesRoutingModule } from './pages-routing.module';
import { LoginLauncherComponent } from './login-launcher/login-launcher.component';

@NgModule({
  imports: [ 
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    CustomFormsModule
  ],
  declarations: [
    p404Component,
    p500Component,
    LoginComponent,
    RegisterComponent,
    ChatbotLoginComponent,
    LoginLauncherComponent
  ],
  // providers: [ChatbotAuthService,UnAuthGuard]
})
export class PagesModule { }
