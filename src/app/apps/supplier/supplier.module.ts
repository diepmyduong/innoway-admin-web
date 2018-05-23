import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,

    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    LaddaModule,

    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28",
      libraries: ["places,drawing"]
    }),
  ],
  declarations: [SupplierComponent, AddComponent]
})
export class SupplierModule { }
