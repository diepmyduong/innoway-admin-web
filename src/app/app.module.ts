import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { MatDialogModule } from '@angular/material';

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

import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

import { ModalCardTypesComponent } from './apps/chatbot/modals/modal-card-types/modal-card-types.component';
import { TooltipModule } from 'ng2-bootstrap/tooltip';

import { ChatbotModule } from './apps/chatbot/chatbot.module';

import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { ServicesModule } from './services';

import { SharedModule } from './shared/shared.module'
import { LayoutsModule } from './layouts/layouts.module';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ColorPickerModule } from 'ngx-color-picker';
import { UiComponentComponent } from './apps/ui-component/ui-component.component';
import { UpdateBillStatusComponentComponent } from './apps/ui-component/update-bill-status-component/update-bill-status-component.component';


import { EditOrderStatusDialog } from "./modal/edit-order-status/edit-order-status.component";


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    Ng2ModalModule.forRoot(),
    ChartsModule,
    ChatbotModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    ServicesModule,
    BootstrapModalModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    MatDialogModule,
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
    EditOrderStatusDialog,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }],
  bootstrap: [AppComponent],
  entryComponents: [
    EditOrderStatusDialog
  ]
})
export class AppModule { }
