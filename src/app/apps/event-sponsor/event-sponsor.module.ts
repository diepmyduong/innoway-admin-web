import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventSponsorRoutingModule } from './event-sponsor-routing.module';
import { EventSponsorComponent } from './event-sponsor.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    EventSponsorRoutingModule
  ],
  declarations: [EventSponsorComponent, AddComponent, DetailComponent]
})
export class EventSponsorModule { }
