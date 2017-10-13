import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ng2-bootstrap/tabs';
import { TextMaskModule } from 'angular2-text-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';


@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    TabsModule,
    TextMaskModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule
  ],
  declarations: [CustomerComponent, DetailComponent, AddComponent],
  providers: []
})
export class CustomerModule { }
