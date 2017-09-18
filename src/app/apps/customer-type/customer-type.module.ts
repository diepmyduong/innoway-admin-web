import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerTypeRoutingModule } from './customer-type-routing.module';
import { CustomerTypeComponent } from './customer-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    CustomerTypeRoutingModule
  ],
  declarations: [CustomerTypeComponent, AddComponent, DetailComponent]
})
export class CustomerTypeModule { }
