import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlacklistRuleRoutingModule } from './blacklist-rule-routing.module';
import { BlacklistRuleComponent } from './blacklist-rule.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    BlacklistRuleRoutingModule
  ],
  declarations: [BlacklistRuleComponent, AddComponent, DetailComponent]
})
export class BlacklistRuleModule { }
