import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionTypeRoutingModule } from './promotion-type-routing.module';
import { PromotionTypeComponent } from './promotion-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';


@NgModule({
  imports: [
    CommonModule,
    PromotionTypeRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
  ],
  declarations: [PromotionTypeComponent, AddComponent, DetailComponent],
  providers: []
})
export class PromotionTypeModule { }
