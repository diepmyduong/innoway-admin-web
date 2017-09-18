import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeComponent } from './product-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { UiSwitchModule } from 'angular2-ui-switch'
import { VSChecklistModule } from 'ng2-vs-checklist';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { CustomFormsModule } from 'ng2-validation';

//Provider

// Loading Buttons
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    ProductTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    VSChecklistModule,
    AngularMultiSelectModule,
    TextMaskModule,
    SimpleNotificationsModule,
    PushNotificationsModule,
    CustomFormsModule,
    DataTableModule,
    LaddaModule
  ],
  declarations: [ProductTypeComponent, AddComponent, DetailComponent]
})
export class ProductTypeModule { }
