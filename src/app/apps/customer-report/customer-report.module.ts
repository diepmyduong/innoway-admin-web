import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerReportRoutingModule } from './customer-report-routing.module';
import { CustomerReportComponent } from './customer-report.component';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { PipesModule } from 'app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    CustomerReportRoutingModule,

    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    LaddaModule,
    PipesModule
  ],
  declarations: [CustomerReportComponent, AddComponent]
})
export class CustomerReportModule { }
