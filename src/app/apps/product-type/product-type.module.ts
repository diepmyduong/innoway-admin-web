import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeComponent } from './product-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng2-validation';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    ProductTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    CustomFormsModule,
    DataTableModule,
    LaddaModule
  ],
  declarations: [ProductTypeComponent, AddComponent, DetailComponent]
})
export class ProductTypeModule { }
