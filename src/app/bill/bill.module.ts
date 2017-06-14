import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill.component';
import { DetailComponent } from './detail/detail.component';
import { OrderComponent } from './order/order.component';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ng2-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    BillRoutingModule,
    TabsModule
  ],
  declarations: [BillComponent, DetailComponent, OrderComponent, AddComponent]
})
export class BillModule { }
