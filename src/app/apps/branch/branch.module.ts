import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    BranchRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    LaddaModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28",
      libraries: ["places,drawing"]
    }),
    // Ng2MapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?libraries=visualization,places,drawing' })//https://maps.google.com/maps/api/js?key=MY_GOOGLE_API_KEY
  ],
  declarations: [BranchComponent, AddComponent, DetailComponent],
  providers: [],
  bootstrap: [BranchComponent, AddComponent, DetailComponent]
})
export class BranchModule { }
