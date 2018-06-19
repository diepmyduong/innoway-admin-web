import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketTypeRoutingModule } from './ticket-type-routing.module';
import { TicketTypeComponent } from './ticket-type.component';
import { AddComponent } from './add/add.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    TicketTypeRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule
  ],
  declarations: [TicketTypeComponent, AddComponent]
})
export class TicketTypeModule { }
