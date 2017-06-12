import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchTypeRoutingModule } from './branch-type-routing.module';
import { BranchTypeComponent } from './branch-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    BranchTypeRoutingModule
  ],
  declarations: [BranchTypeComponent, AddComponent, DetailComponent]
})
export class BranchTypeModule { }
