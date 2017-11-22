import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
//import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    AreaRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    // DataTableModule
  ],
  declarations: [AreaComponent, AddComponent, DetailComponent]
})
export class AreaModule { }
