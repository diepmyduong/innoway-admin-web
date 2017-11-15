import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnowayService } from './innoway.service';
import { AuthService } from './auth.service';

//Guard
import { AuthGuard } from './guards/auth.guard';
import { AnonymousGuard } from './guards/anonymous.guard';
import { ChatbotConfigService } from './chatbot/chatbot-config.service';
import { ChatbotAuthService } from './chatbot/chatbot-auth.service';
import { ChatbotApiService } from './chatbot/chatbot-api.service';
import { ChatbotAuthGuard } from './guards/chatbot-auth.guard';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    InnowayService,
    AuthService,

    AuthGuard,

    AnonymousGuard,

    ChatbotConfigService,

    ChatbotAuthService,

    ChatbotApiService,

    ChatbotAuthGuard,
  ]
})
export class ServicesModule { }
