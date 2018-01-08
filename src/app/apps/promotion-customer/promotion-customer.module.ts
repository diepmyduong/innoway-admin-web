import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionCustomerRoutingModule } from './promotion-customer-routing.module';
import { PromotionCustomerComponent } from './promotion-customer.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    CommonModule,
    PromotionCustomerRoutingModule
  ],
  declarations: [PromotionCustomerComponent, AddComponent]
})
export class PromotionCustomerModule { }
