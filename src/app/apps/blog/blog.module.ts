import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';


@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule
  ],
  declarations: [BlogComponent, DetailComponent, AddComponent]
})
export class BlogModule { }
