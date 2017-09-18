import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy,PathLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
// Routing Module
import { AppRoutingModule } from './app.routing';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { LauncherLayoutComponent } from './layouts/launcher-layout/launcher-layout.component';

//Modal
// import { ModalModule } from 'ng2-bootstrap/modal';
import { ModalModule as Ng2ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { ModalCardTypesComponent } from './chatbot/modals/modal-card-types/modal-card-types.component';
import { ChatbotLayoutComponent } from './layouts/chatbot-layout/chatbot-layout.component';

import { ChatbotModule } from './chatbot/chatbot.module';

import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { ServicesModule } from './services';
// import { ModalComponent } from './modal/modal.component';

import { ModalModule } from 'ng2-bootstrap/modal';
// import { ModalModule as CustomModal} from './modal/modal.module';

// import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    // ModalModule.forRoot(),
    Ng2ModalModule.forRoot(),
    BootstrapModalModule,
    ChartsModule,
    ChatbotModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    ServicesModule,
    ModalModule.forRoot(),
    // AgmCoreModule.forRoot({
    //   apiKey: "AIzaSyD60ceziJ8eJ3hmxlTeUzGuysXPnehQ4uM",
    //   libraries: ["places"]
    // }),
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    ChatbotLayoutComponent,
    LauncherLayoutComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
