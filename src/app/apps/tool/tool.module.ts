import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolRoutingModule } from './tool-routing.module';
import { ToolComponent } from './tool.component';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { TabsModule } from 'ng2-bootstrap/tabs';
import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

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
    PushNotificationsModule,

    TabsModule.forRoot(),

    ToasterModule
  ],
  declarations: [ToolComponent],
  bootstrap: [ToolComponent],
})
export class ToolModule { }
