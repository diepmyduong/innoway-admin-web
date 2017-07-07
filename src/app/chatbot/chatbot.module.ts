import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule} from '@angular/common';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';
// import { TreeModule } from 'angular-tree-component';
// import { TreeModule } from 'ng2-tree';
//Modal
import { ModalModule } from 'ng2-bootstrap/modal';
import { ModalModule as Ng2ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { SelectModule } from 'ng2-select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { StoryComponent } from './story/story.component';
import { NotificationComponent } from './notification/notification.component';
import { ModalCardTypesComponent } from './modals/modal-card-types/modal-card-types.component';
import { ModalTextCardComponent } from './modals/modal-text-card/modal-text-card.component';
import { ModalButtonCardComponent } from './modals/modal-button-card/modal-button-card.component';
import { ModalImageCardComponent } from './modals/modal-image-card/modal-image-card.component';
import { StoriesPortalComponent } from './portals/stories-portal/stories-portal.component';
import { StoryPortalComponent } from './portals/story-portal/story-portal.component';
import { AuthGuard, UnAuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { PageService } from './services/page.service';
import { GreetingPortalComponent } from './portals/greeting-portal/greeting-portal.component';
import { MenuPortalComponent } from './portals/menu-portal/menu-portal.component';
import { GetStartedPortalComponent } from './portals/get-started-portal/get-started-portal.component';
import { SubmenuPortalComponent } from './portals/submenu-portal/submenu-portal.component';
import { ModalMenuItemTypesComponent } from './modals/modal-menu-item-types/modal-menu-item-types.component';


@NgModule({
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    TabsModule,
    ModalModule.forRoot(),
    Ng2ModalModule,
    BootstrapModalModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  entryComponents: [
    ModalCardTypesComponent,
    ModalTextCardComponent,
    ModalButtonCardComponent,
    ModalImageCardComponent,
    ModalMenuItemTypesComponent
  ],
  declarations: [ChatbotComponent, LoginComponent, DashboardComponent, SettingsComponent, StoryComponent, NotificationComponent, ModalCardTypesComponent, ModalTextCardComponent, ModalButtonCardComponent, ModalImageCardComponent, StoriesPortalComponent, StoryPortalComponent, GreetingPortalComponent, MenuPortalComponent, GetStartedPortalComponent, SubmenuPortalComponent, ModalMenuItemTypesComponent],
  providers: [PageService],
  // providers: [AuthGuard, AuthService,UnAuthGuard]
})
export class ChatbotModule {
  static forRoot() : ModuleWithProviders {
      return {
          ngModule: ChatbotModule,
          providers: [
              AuthService,
              AuthGuard,
              UnAuthGuard
          ]
      };
  }
}
