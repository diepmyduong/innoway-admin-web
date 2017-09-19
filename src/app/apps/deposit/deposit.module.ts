import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositRoutingModule } from './deposit-routing.module';
import { DepositComponent } from './deposit.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    DepositRoutingModule
  ],
  declarations: [DepositComponent, AddComponent, DetailComponent]
})
export class DepositModule { }
