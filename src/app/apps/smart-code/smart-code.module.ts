import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartCodeRoutingModule } from './smart-code-routing.module';
import { SmartCodeComponent } from './smart-code.component';
import { AddComponent } from './add/add.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from 'app/pipes/pipes.module';
import { DetailComponent } from './detail/detail.component'

@NgModule({
  imports: [
    CommonModule,
    SmartCodeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,

    PipesModule
  ],
  declarations: [SmartCodeComponent, AddComponent, DetailComponent]
})
export class SmartCodeModule { }
