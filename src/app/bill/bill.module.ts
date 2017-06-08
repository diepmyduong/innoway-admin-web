import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill.component';

@NgModule({
  imports: [
    CommonModule,
    BillRoutingModule
  ],
  declarations: [BillComponent]
})
export class BillModule { }
