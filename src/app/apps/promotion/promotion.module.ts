import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionComponent } from './promotion.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { TextMaskModule } from 'angular2-text-mask';
import { FroalaComponent } from "app/apps/promotion/add/froala.component";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
// import { FroalaComponent } from "app/apps/promotion/add/froala.component";
@NgModule({
  imports: [
    CommonModule,
    PromotionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ],
  declarations: [
    PromotionComponent,
    AddComponent,
    DetailComponent,
    FroalaComponent],
  providers: []
})
export class PromotionModule { }
