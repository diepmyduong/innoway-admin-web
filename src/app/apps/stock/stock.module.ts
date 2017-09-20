import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    CommonModule,
    StockRoutingModule
  ],
  declarations: [StockComponent, DetailComponent, AddComponent]
})
export class StockModule { }
