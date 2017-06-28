import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { TreeModule } from 'angular-tree-component';
//Modal
import { ModalModule } from 'ng2-bootstrap/modal';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { StoryComponent } from './story/story.component';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    TabsModule,
    TreeModule,
    ModalModule.forRoot(),
  ],
  declarations: [ChatbotComponent, LoginComponent, DashboardComponent, SettingsComponent, StoryComponent, NotificationComponent]
})
export class ChatbotModule { }
