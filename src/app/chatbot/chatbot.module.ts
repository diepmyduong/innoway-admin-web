import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { TreeModule } from 'angular-tree-component';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    TabsModule,
    TreeModule
  ],
  declarations: [ChatbotComponent, LoginComponent, DashboardComponent, SettingsComponent]
})
export class ChatbotModule { }
