import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipRoutingModule } from './ship-routing.module';
import { ShipComponent } from './ship.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { TextMaskModule } from 'angular2-text-mask';

import { Component } from "@angular/core";

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from "ngx-bootstrap/tabs";

@NgModule({
  imports: [
    CommonModule,
    ShipRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,

    TabsModule.forRoot(),
    AccordionModule.forRoot()
  ],
  declarations: [ShipComponent, AddComponent, DetailComponent],
  bootstrap: [
    ShipComponent, AddComponent, DetailComponent
  ]
})
export class ShipModule { }
