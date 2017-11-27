import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
// Routing Module
import { AppRoutingModule } from './app.routing';
import { ModalModule as Ng2ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { ModalCardTypesComponent } from './apps/chatbot/modals/modal-card-types/modal-card-types.component';

import { ChatbotModule } from './apps/chatbot/chatbot.module';

import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { ServicesModule } from './services';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from './shared/shared.module'
import { LayoutsModule } from './layouts/layouts.module';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ColorPickerModule } from 'ngx-color-picker';
import { UiComponentComponent } from './apps/ui-component/ui-component.component';
import { UpdateBillStatusComponentComponent } from './apps/ui-component/update-bill-status-component/update-bill-status-component.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    Ng2ModalModule.forRoot(),
    BootstrapModalModule,
    ChartsModule,
    ChatbotModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    ServicesModule,
    ModalModule.forRoot(),
    SharedModule,
    LayoutsModule,
    FormsModule,
    // BsDropdownModule.forRoot(),
    ColorPickerModule,
  ],
  declarations: [
    AppComponent,
    UiComponentComponent,
    UpdateBillStatusComponentComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
