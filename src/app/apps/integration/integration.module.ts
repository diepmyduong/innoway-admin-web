import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationComponent } from './integration.component';
import { KiotvietComponent } from './kiotviet/kiotviet.component';
import { ApiAiComponent } from './api-ai/api-ai.component';
import { GiaohangnhanhComponent } from './giaohangnhanh/giaohangnhanh.component';
import { AhamoveComponent } from './ahamove/ahamove.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { MitekComponent } from './mitek/mitek.component';

@NgModule({
  imports: [
    CommonModule,
    IntegrationRoutingModule
  ],
  declarations: [IntegrationComponent, KiotvietComponent, ApiAiComponent, GiaohangnhanhComponent, AhamoveComponent, ChatbotComponent, MitekComponent]
})
export class IntegrationModule { }
