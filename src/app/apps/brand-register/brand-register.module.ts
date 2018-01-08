import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRegisterRoutingModule } from './brand-register-routing.module';
import { BrandRegisterComponent } from './brand-register.component';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { AgmCoreModule } from "@agm/core";

@NgModule({
  imports: [
    CommonModule,
    BrandRegisterRoutingModule,

    LaddaModule,
    DataTableModule,
    TextMaskModule,

    TabsModule,

    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule,
    PushNotificationsModule,

    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28",
      libraries: ["places,drawing"]
    }),
  ],
  declarations: [BrandRegisterComponent],
  bootstrap: [BrandRegisterComponent],
})
export class BrandRegisterModule { }
