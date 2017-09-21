import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { VSChecklistModule } from 'ng2-vs-checklist';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { CustomFormsModule } from 'ng2-validation';

import { ToppingRoutingModule } from './topping-routing.module';
import { ToppingComponent } from './topping.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { ModalModule as CustomModal} from 'app/modal/modal.module';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
@NgModule({
  imports: [
    CommonModule,
    ToppingRoutingModule,
    FormsModule,
    VSChecklistModule,
    AngularMultiSelectModule,
    CustomFormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    SimpleNotificationsModule,
    PushNotificationsModule,
    CustomModal,
    LaddaModule,
    DataTableModule
  ],
  declarations: [ToppingComponent, AddComponent, DetailComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ToppingModule { }
