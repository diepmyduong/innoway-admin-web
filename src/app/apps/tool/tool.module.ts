import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolRoutingModule } from './tool-routing.module';
import { ToolComponent } from './tool.component';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    CommonModule,
    ToolRoutingModule,

    LaddaModule,
    DataTableModule,
    TextMaskModule,

    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule,
    PushNotificationsModule
  ],
  declarations: [ToolComponent]
})
export class ToolModule { }
