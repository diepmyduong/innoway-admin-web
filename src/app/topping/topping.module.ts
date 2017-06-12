import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToppingRoutingModule } from './topping-routing.module';
import { ToppingComponent } from './topping.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    ToppingRoutingModule
  ],
  declarations: [ToppingComponent, AddComponent, DetailComponent]
})
export class ToppingModule { }
