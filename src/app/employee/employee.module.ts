import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { TabsModule } from 'ng2-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    TabsModule
  ],
  declarations: [EmployeeComponent, AddComponent, DetailComponent]
})
export class EmployeeModule { }
