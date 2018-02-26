import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketCommentRoutingModule } from './ticket-comment-routing.module';
import { TicketCommentComponent } from './ticket-comment.component';
import { AddComponent } from './add/add.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

@NgModule({
  imports: [
    CommonModule,
    TicketCommentRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule
  ],
  declarations: [TicketCommentComponent, AddComponent]
})
export class TicketCommentModule { }
