import { NgModule,ModuleWithProviders } from '@angular/core';
import { CommonModule} from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TagInputModule } from 'ngx-chips';
import { SwiperModule } from 'angular2-useful-swiper';
// import { TreeModule } from 'angular-tree-component';
// import { TreeModule } from 'ng2-tree';
//Modal
import { ModalModule } from 'ngx-bootstrap/modal';
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
import { ModalStoryComponent } from './modals/modal-story/modal-story.component';
import { TextCardComponent } from './cards/text-card/text-card.component';
import { ButtonsCardComponent } from './cards/buttons-card/buttons-card.component';
import { ModalButtonTypesComponent } from './modals/modal-button-types/modal-button-types.component';
import { QuickRepliesPortalComponent } from './portals/quick-replies-portal/quick-replies-portal.component';
import { ModalQuickRepliesItemComponent } from './modals/modal-quick-replies-item/modal-quick-replies-item.component';
import { GenericPortalComponent } from './portals/generic-portal/generic-portal.component';
import { GenericCardComponent } from './cards/generic-card/generic-card.component';
import { ModalGenericCardComponent } from './modals/modal-generic-card/modal-generic-card.component';
import { ModalElementComponent } from './modals/modal-element/modal-element.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { SubscribersPortalComponent } from './portals/subscribers-portal/subscribers-portal.component';
import { ModalSendStoryComponent } from './modals/modal-send-story/modal-send-story.component';
import { SchedulePortalComponent } from './portals/schedule-portal/schedule-portal.component';


@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    ChatbotRoutingModule,
    TabsModule,
    ModalModule.forRoot(),
    Ng2ModalModule,
    BootstrapModalModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    SwiperModule
  ],
  entryComponents: [
    ModalCardTypesComponent,
    ModalTextCardComponent,
    ModalButtonCardComponent,
    ModalImageCardComponent,
    ModalMenuItemTypesComponent,
    ModalStoryComponent,
    ModalButtonTypesComponent,
    ModalQuickRepliesItemComponent,
    ModalGenericCardComponent,
    ModalElementComponent,
    ModalSendStoryComponent
  ],
  declarations: [ChatbotComponent, LoginComponent, DashboardComponent, SettingsComponent, StoryComponent, NotificationComponent, ModalCardTypesComponent, ModalTextCardComponent, ModalButtonCardComponent, ModalImageCardComponent, StoriesPortalComponent, StoryPortalComponent, GreetingPortalComponent, MenuPortalComponent, GetStartedPortalComponent, SubmenuPortalComponent, ModalMenuItemTypesComponent, ModalStoryComponent, TextCardComponent, ButtonsCardComponent, ModalButtonTypesComponent, QuickRepliesPortalComponent, ModalQuickRepliesItemComponent, GenericPortalComponent, GenericCardComponent, ModalGenericCardComponent, ModalElementComponent, SubscribersComponent, SubscribersPortalComponent, ModalSendStoryComponent, SchedulePortalComponent],
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
