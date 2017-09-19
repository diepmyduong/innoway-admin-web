import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    ServiceRoutingModule
  ],
  declarations: [ServiceComponent, AddComponent, DetailComponent]
})
export class ServiceModule { }
