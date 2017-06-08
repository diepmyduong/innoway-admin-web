import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionComponent } from './promotion.component';

@NgModule({
  imports: [
    CommonModule,
    PromotionRoutingModule
  ],
  declarations: [PromotionComponent]
})
export class PromotionModule { }
