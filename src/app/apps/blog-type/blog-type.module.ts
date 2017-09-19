import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogTypeRoutingModule } from './blog-type-routing.module';
import { BlogTypeComponent } from './blog-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    BlogTypeRoutingModule
  ],
  declarations: [BlogTypeComponent, AddComponent, DetailComponent]
})
export class BlogTypeModule { }
