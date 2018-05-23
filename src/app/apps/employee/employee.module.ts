import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { AgmCoreModule } from '@agm/core';

import { MatTooltipModule } from '@angular/material';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,

    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    LaddaModule,

    MatTooltipModule,
    TooltipModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28",
      libraries: ["places,drawing"]
    }),
  ],
  declarations: [EmployeeComponent, AddComponent, DetailComponent],
  providers: [],
})
export class EmployeeModule { }
