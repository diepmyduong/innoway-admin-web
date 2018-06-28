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
import { PipesModule } from 'app/pipes/pipes.module'


import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillEditorModule } from "ngx-quill-editor";
import { Ng4JsonEditorModule } from "angular4-jsoneditor";
import { ChartsModule } from 'ng2-charts/ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    PromotionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,

    PipesModule,
    TabsModule,

    ChartsModule,

    QuillEditorModule,
    Ng4JsonEditorModule
  ],
  declarations: [
    PromotionComponent,
    AddComponent,
    DetailComponent],
  providers: []
})
export class PromotionModule { }
