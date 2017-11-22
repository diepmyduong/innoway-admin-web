import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandTypeRoutingModule } from './brand-type-routing.module';
import { BrandTypeComponent } from './brand-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    BrandTypeRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28",
      libraries: ["places,drawing"]
    }),
  ],
  declarations: [BrandTypeComponent, AddComponent, DetailComponent]
})
export class BrandTypeModule { }
