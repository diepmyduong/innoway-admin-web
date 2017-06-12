import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ng2-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    TabsModule
  ],
  declarations: [CustomerComponent, DetailComponent, AddComponent]
})
export class CustomerModule { }
