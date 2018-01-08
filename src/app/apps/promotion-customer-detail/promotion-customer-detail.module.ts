import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionCustomerDetailRoutingModule } from './promotion-customer-detail-routing.module';
import { PromotionCustomerDetailComponent } from './promotion-customer-detail.component';

@NgModule({
  imports: [
    CommonModule,
    PromotionCustomerDetailRoutingModule
  ],
  declarations: [PromotionCustomerDetailComponent]
})
export class PromotionCustomerDetailModule { }
