import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventSpeakerRoutingModule } from './event-speaker-routing.module';
import { EventSpeakerComponent } from './event-speaker.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    EventSpeakerRoutingModule
  ],
  declarations: [EventSpeakerComponent, AddComponent, DetailComponent]
})
export class EventSpeakerModule { }
