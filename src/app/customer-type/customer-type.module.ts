import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTypeRoutingModule } from './customer-type-routing.module';
import { CustomerTypeComponent } from './customer-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { InnowayServiceService } from "app/services/innoway-service.service";

@NgModule({
  imports: [
    CommonModule,
    CustomerTypeRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule
  ],
  declarations: [CustomerTypeComponent, AddComponent, DetailComponent],
  providers: [InnowayServiceService]
})
export class CustomerTypeModule { }
