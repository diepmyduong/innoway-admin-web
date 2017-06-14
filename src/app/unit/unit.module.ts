import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRoutingModule } from './unit-routing.module';
import { UnitComponent } from './unit.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    UnitRoutingModule
  ],
  declarations: [UnitComponent, AddComponent, DetailComponent]
})
export class UnitModule { }
