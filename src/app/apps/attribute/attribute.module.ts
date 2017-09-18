import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeRoutingModule } from './attribute-routing.module';
import { AttributeComponent } from './attribute.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    AttributeRoutingModule
  ],
  declarations: [AttributeComponent, AddComponent, DetailComponent]
})
export class AttributeModule { }
