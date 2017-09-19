import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { TimepickerModule } from 'ng2-bootstrap/timepicker';
import { DatepickerModule } from 'ng2-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    BrandRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,

    TimepickerModule.forRoot(),
    DatepickerModule.forRoot(),
  ],
  declarations: [BrandComponent, AddComponent, DetailComponent],
  providers: []
})
export class BrandModule { }
