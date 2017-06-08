import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';

@NgModule({
  imports: [
    CommonModule,
    FeedbackRoutingModule
  ],
  declarations: [FeedbackComponent]
})
export class FeedbackModule { }
