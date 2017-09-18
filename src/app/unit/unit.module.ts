import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRoutingModule } from './unit-routing.module';
import { UnitComponent } from './unit.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { InnowayServiceService } from "app/services/innoway-service.service";

import { AccordionModule } from "ng2-accordion";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  imports: [
    CommonModule,
    UnitRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AccordionModule,
  ],
  declarations: [UnitComponent, AddComponent, DetailComponent],
  providers: [InnowayServiceService],
  bootstrap: [UnitComponent, AddComponent, DetailComponent]
})
export class UnitModule { }
