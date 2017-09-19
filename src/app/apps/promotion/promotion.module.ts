import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionComponent } from './promotion.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    PromotionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule
  ],
  declarations: [PromotionComponent, AddComponent, DetailComponent],
  providers: []
})
export class PromotionModule { }
