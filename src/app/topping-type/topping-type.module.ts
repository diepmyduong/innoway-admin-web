import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToppingTypeRoutingModule } from './topping-type-routing.module';
import { ToppingTypeComponent } from './topping-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    ToppingTypeRoutingModule
  ],
  declarations: [ToppingTypeComponent, AddComponent, DetailComponent]
})
export class ToppingTypeModule { }
