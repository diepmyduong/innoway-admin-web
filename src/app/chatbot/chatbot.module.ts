import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot.component';

@NgModule({
  imports: [
    CommonModule,
    ChatbotRoutingModule
  ],
  declarations: [ChatbotComponent]
})
export class ChatbotModule { }
