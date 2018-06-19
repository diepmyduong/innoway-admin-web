import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierCategoryComponent } from './supplier-category.component';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { SupplierCategoryRoutingModule } from "./supplier-category-routing.module";

@NgModule({
  imports: [
    CommonModule,
    SupplierCategoryRoutingModule,

    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    LaddaModule,
  ],
  declarations: [SupplierCategoryComponent, AddComponent]
})
export class SupplierCategoryModule { }
