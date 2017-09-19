import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTypeRoutingModule } from './employee-type-routing.module';
import { EmployeeTypeComponent } from './employee-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    EmployeeTypeRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
  ],
  declarations: [EmployeeTypeComponent, AddComponent, DetailComponent],
  providers: []
})
export class EmployeeTypeModule { }
