import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { SwiperModule } from 'angular2-useful-swiper';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { 
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatGridListModule,
  MatTableModule,
  MatInputModule,
}from '@angular/material'

import { PosRoutingModule } from './pos-routing.module';
import { PosComponent } from './pos.component';

@NgModule({
  imports: [
    CommonModule,
    PosRoutingModule,
    SwiperModule,
    SidebarModule,
    NgbModule,
    DataTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatTableModule,
    MatInputModule,
  ],
  declarations: [PosComponent]
})
export class PosModule { }
