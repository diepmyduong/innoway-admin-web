import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlacklistRoutingModule } from './blacklist-routing.module';
import { BlacklistComponent } from './blacklist.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    BlacklistRoutingModule
  ],
  declarations: [BlacklistComponent, AddComponent, DetailComponent]
})
export class BlacklistModule { }
