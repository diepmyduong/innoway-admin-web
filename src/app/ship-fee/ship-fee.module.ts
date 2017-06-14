import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipFeeRoutingModule } from './ship-fee-routing.module';
import { ShipFeeComponent } from './ship-fee.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    ShipFeeRoutingModule
  ],
  declarations: [ShipFeeComponent, AddComponent, DetailComponent]
})
export class ShipFeeModule { }
