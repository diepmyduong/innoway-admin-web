import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    AreaRoutingModule
  ],
  declarations: [AreaComponent, AddComponent, DetailComponent]
})
export class AreaModule { }
