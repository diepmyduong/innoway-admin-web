import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventAgendaRoutingModule } from './event-agenda-routing.module';
import { EventAgendaComponent } from './event-agenda.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    EventAgendaRoutingModule
  ],
  declarations: [EventAgendaComponent, AddComponent, DetailComponent]
})
export class EventAgendaModule { }
