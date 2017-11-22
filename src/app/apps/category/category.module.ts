import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
// import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    CategoryRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    // DataTableModule
  ],
  declarations: [CategoryComponent, AddComponent, DetailComponent]
})
export class CategoryModule { }
