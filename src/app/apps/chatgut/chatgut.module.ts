import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { SwiperModule } from 'angular2-useful-swiper';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { 
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatGridListModule,
  MatTableModule,
  MatInputModule,
  MatListModule,
  MatButtonModule,
  MatMenuModule,
  MatDialogModule,
  MatExpansionModule,
  MatCardModule,
  MatOptionModule,
  MatChipsModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatRadioModule,
  MatAutocompleteModule,
}from '@angular/material'

import { ChatgutRoutingModule } from './chatgut-routing.module';
import { ChatgutComponent } from './chatgut.component';
import { PortalContainerComponent } from './portals/portal-container/portal-container.component';
import { StoriesPortalComponent } from './portals/stories-portal/stories-portal.component';
import { StoryDetailPortalComponent } from './portals/story-detail-portal/story-detail-portal.component';
import { TextCardComponent } from './cards/text-card/text-card.component';
import { CardContainerComponent } from './cards/card-container/card-container.component';
import { ImageCardComponent } from './cards/image-card/image-card.component';
import { VideoCardComponent } from './cards/video-card/video-card.component';
import { AudioCardComponent } from './cards/audio-card/audio-card.component';
import { ButtonsCardComponent } from './cards/buttons-card/buttons-card.component';
import { ButtonContainerComponent } from './buttons/button-container/button-container.component';
import { UrlButtonComponent } from './buttons/url-button/url-button.component';
import { PostbackButtonComponent } from './buttons/postback-button/postback-button.component';
import { PhoneButtonComponent } from './buttons/phone-button/phone-button.component';
import { GenericCardComponent } from './cards/generic-card/generic-card.component';
import { SettingsPortalComponent } from './portals/settings-portal/settings-portal.component';
import { MenuPortalComponent } from './portals/menu-portal/menu-portal.component';
import { MenuCardComponent } from './cards/menu-card/menu-card.component';
import { NestedButtonComponent } from './buttons/nested-button/nested-button.component';
import { GreetingPortalComponent } from './portals/greeting-portal/greeting-portal.component';
import { WhiteListPortalComponent } from './portals/white-list-portal/white-list-portal.component';
import { DomainComponent } from './portals/white-list-portal/domain/domain.component';
import { QuickReplyCardComponent } from './cards/quick-reply-card/quick-reply-card.component';
import { TextQuickReplyButtonComponent } from './buttons/text-quick-reply-button/text-quick-reply-button.component';
import { GenericCategoriesCardComponent } from './cards/generic-categories-card/generic-categories-card.component';
import { QuickReplyPortalComponent } from './portals/quick-reply-portal/quick-reply-portal.component';
import { LocationQuickReplyButtonComponent } from './buttons/location-quick-reply-button/location-quick-reply-button.component';

@NgModule({
  imports: [
    CommonModule,
    ChatgutRoutingModule,
    SwiperModule,
    SidebarModule,
    NgbModule,
    DataTableModule,
    FormsModule, ReactiveFormsModule,
    Ng2DragDropModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatTableModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    MatCardModule,
    MatOptionModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
  ],
  declarations: [ChatgutComponent, PortalContainerComponent, StoriesPortalComponent, StoryDetailPortalComponent, TextCardComponent, CardContainerComponent, ImageCardComponent, VideoCardComponent, AudioCardComponent, ButtonsCardComponent, ButtonContainerComponent, UrlButtonComponent, PostbackButtonComponent, PhoneButtonComponent, GenericCardComponent, SettingsPortalComponent, MenuPortalComponent, MenuCardComponent, NestedButtonComponent, GreetingPortalComponent, WhiteListPortalComponent, DomainComponent, QuickReplyCardComponent, TextQuickReplyButtonComponent, GenericCategoriesCardComponent, QuickReplyPortalComponent, LocationQuickReplyButtonComponent],
  entryComponents: [StoriesPortalComponent,StoryDetailPortalComponent,TextCardComponent,ImageCardComponent,VideoCardComponent,AudioCardComponent,ButtonsCardComponent,UrlButtonComponent,PostbackButtonComponent,PhoneButtonComponent,GenericCardComponent,SettingsPortalComponent,MenuPortalComponent,MenuCardComponent,NestedButtonComponent,GreetingPortalComponent,WhiteListPortalComponent,QuickReplyCardComponent,TextQuickReplyButtonComponent,GenericCategoriesCardComponent,QuickReplyPortalComponent,LocationQuickReplyButtonComponent]
})
export class ChatgutModule { }
