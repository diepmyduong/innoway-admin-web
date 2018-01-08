import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandCategoryRoutingModule } from './brand-category-routing.module';
import { BrandCategoryComponent } from './brand-category.component';
import { AddComponent } from './add/add.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    BrandCategoryRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,
  ],
  declarations: [BrandCategoryComponent, AddComponent],
  providers: []
})
export class BrandCategoryModule { }
