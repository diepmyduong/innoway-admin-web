import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRuleRoutingModule } from './feedback-rule-routing.module';
import { FeedbackRuleComponent } from './feedback-rule.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    FeedbackRuleRoutingModule
  ],
  declarations: [FeedbackRuleComponent, AddComponent, DetailComponent]
})
export class FeedbackRuleModule { }
