import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { InnowayServiceService } from "app/services/innoway-service.service";

import { TimepickerModule } from 'ng2-bootstrap/timepicker';
import { DatepickerModule } from 'ng2-bootstrap/datepicker';

import {ColorPickerModule} from 'angular2-color-picker';
import { CustomFormsModule } from 'ng2-validation';
// Angular 2 Input Mask
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    BrandRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,

    ColorPickerModule,
    CustomFormsModule,
    TextMaskModule
  ],
  declarations: [BrandComponent, AddComponent, DetailComponent],
  providers: [InnowayServiceService]
})
export class BrandModule { }
