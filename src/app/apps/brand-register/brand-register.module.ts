import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRegisterRoutingModule } from './brand-register-routing.module';
import { BrandRegisterComponent } from './brand-register.component';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    CommonModule,
    BrandRegisterRoutingModule,

    LaddaModule,
    DataTableModule,
    TextMaskModule,

    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule,
    PushNotificationsModule
  ],
  declarations: [BrandRegisterComponent]
})
export class BrandRegisterModule { }
