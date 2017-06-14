import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipFeeTypeRoutingModule } from './ship-fee-type-routing.module';
import { ShipFeeTypeComponent } from './ship-fee-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    ShipFeeTypeRoutingModule
  ],
  declarations: [ShipFeeTypeComponent, AddComponent, DetailComponent]
})
export class ShipFeeTypeModule { }
