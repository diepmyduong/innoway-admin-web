import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';

@NgModule({
  imports: [
    CommonModule,
    SummaryRoutingModule
  ],
  declarations: [SummaryComponent]
})
export class SummaryModule { }
