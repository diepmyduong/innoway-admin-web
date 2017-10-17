import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidHistoryRoutingModule } from './paid-history-routing.module';
import { PaidHistoryComponent } from './paid-history.component';

@NgModule({
  imports: [
    CommonModule,
    PaidHistoryRoutingModule
  ],
  declarations: [PaidHistoryComponent]
})
export class PaidHistoryModule { }
