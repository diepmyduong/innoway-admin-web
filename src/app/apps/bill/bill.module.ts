import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ng2-bootstrap/tabs';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    BillRoutingModule,
    TabsModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule
  ],
  declarations: [BillComponent, DetailComponent, AddComponent]
})
export class BillModule { }
