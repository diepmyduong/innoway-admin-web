import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketResultRoutingModule } from './ticket-result-routing.module';
import { TicketResultComponent } from './ticket-result.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    CommonModule,
    TicketResultRoutingModule
  ],
  declarations: [TicketResultComponent, AddComponent]
})
export class TicketResultModule { }
