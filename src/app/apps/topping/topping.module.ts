import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { ToppingRoutingModule } from './topping-routing.module';
import { ToppingComponent } from './topping.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { LaddaModule } from 'angular2-ladda';
// import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { PipesModule } from 'app/pipes/pipes.module'

@NgModule({
  imports: [
    CommonModule,
    ToppingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    LaddaModule,
    // DataTableModule,
    TextMaskModule,
    PipesModule
  ],
  declarations: [ToppingComponent, AddComponent, DetailComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ToppingModule { }
