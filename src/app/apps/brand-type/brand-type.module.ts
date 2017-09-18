import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandTypeRoutingModule } from './brand-type-routing.module';
import { BrandTypeComponent } from './brand-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    BrandTypeRoutingModule
  ],
  declarations: [BrandTypeComponent, AddComponent, DetailComponent]
})
export class BrandTypeModule { }
