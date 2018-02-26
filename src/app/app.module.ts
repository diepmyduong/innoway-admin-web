import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';

import { AppComponent } from './app.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
// Routing Module
import { AppRoutingModule } from './app.routing';
// import { ModalModule as Ng2ModalModule } from 'angular2-modal';

import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

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
import { EditInfoDialog } from "./modal/edit-info/edit-info.component";
import { ChangePasswordDialog } from "./modal/change-password/change-password.component";
import { ConfigChatbotStoryDialog } from "./modal/config-chatbot-story/config-chatbot-story.component";
import { UpdateBillDataDialog } from "./modal/update-bill-data/update-bill-data.component";
import { UpdatePaidHistoryDialog } from "./modal/update-paid-history/update-paid-history.component";
import { SendMessageDialog } from "./modal/send-message/send-message.component";
import { SendStoryDialog } from "./modal/send-story/send-story.component";
import { GuideCustomerDialog } from "./modal/guide-customer/guide-customer.component";
import { TextMaskModule } from 'angular2-text-mask';

import Raven = require('raven-js');

Raven
  .config('https://997c474fe1004e2da0f34f05c79c540e@sentry.io/278600')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError || err);
    console.error(err)
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    // Ng2ModalModule.forRoot(),
    ChartsModule,
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    ServicesModule,
    BootstrapModalModule,
    ModalModule.forRoot(),
    MatDialogModule,
    MatTooltipModule,
    SharedModule,
    LayoutsModule,
    FormsModule,
    TextMaskModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    // BsDropdownModule.forRoot(),
    ColorPickerModule,
  ],
  declarations: [
    AppComponent,
    UiComponentComponent,
    UpdateBillStatusComponentComponent,
    EditOrderStatusDialog,
    EditInfoDialog,
    ChangePasswordDialog,
    ConfigChatbotStoryDialog,
    UpdateBillDataDialog,
    UpdatePaidHistoryDialog,
    SendMessageDialog,
    SendStoryDialog,
    GuideCustomerDialog,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: ErrorHandler,
      useClass: RavenErrorHandler
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditOrderStatusDialog,
    EditInfoDialog,
    ChangePasswordDialog,
    ConfigChatbotStoryDialog,
    UpdateBillDataDialog,
    UpdatePaidHistoryDialog,
    SendMessageDialog,
    SendStoryDialog,
    GuideCustomerDialog
  ]
})
export class AppModule { }
