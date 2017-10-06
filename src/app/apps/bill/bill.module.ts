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
import { TextMaskModule } from 'angular2-text-mask';

import { PipesModule } from 'app/pipes/pipes.module';
import { PaidComponent } from './paid/paid.component';
import { PaidListComponent } from './paid-list/paid-list.component'

@NgModule({
  imports: [
    CommonModule,
    BillRoutingModule,
    TabsModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,
    
    PipesModule
  ],
  declarations: [BillComponent, DetailComponent, AddComponent, PaidComponent, PaidListComponent]
})
export class BillModule { }
