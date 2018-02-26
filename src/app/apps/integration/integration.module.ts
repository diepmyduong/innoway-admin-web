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

import { TabsModule } from 'ngx-bootstrap/tabs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { AgmCoreModule } from '@agm/core';

import { MatTooltipModule } from '@angular/material';
import { TooltipModule } from 'ngx-bootstrap';
import { UberDeliverComponent } from './uber-deliver/uber-deliver.component';
import { GhtkComponent } from './ghtk/ghtk.component';

@NgModule({
  imports: [
    CommonModule,
    IntegrationRoutingModule,

    TabsModule,

    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    LaddaModule,
    MatTooltipModule,
    TooltipModule.forRoot(),
  ],
  declarations: [IntegrationComponent, KiotvietComponent, ApiAiComponent, GiaohangnhanhComponent, AhamoveComponent, ChatbotComponent, MitekComponent, UberDeliverComponent, GhtkComponent]
})
export class IntegrationModule { }
