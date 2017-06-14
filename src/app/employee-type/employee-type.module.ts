import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTypeRoutingModule } from './employee-type-routing.module';
import { EmployeeTypeComponent } from './employee-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    EmployeeTypeRoutingModule
  ],
  declarations: [EmployeeTypeComponent, AddComponent, DetailComponent]
})
export class EmployeeTypeModule { }
