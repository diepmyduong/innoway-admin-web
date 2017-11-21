import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BillsComponent } from './bills/bills.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { LaddaModule } from 'angular2-ladda';
//import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { PipesModule } from 'app/pipes/pipes.module'
import { SwiperModule } from 'angular2-useful-swiper';
import { BillLocationComponent } from './bill-location/bill-location.component';

import { AgmCoreModule } from '@agm/core';
// Notifications
import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

import { DashboardService } from "app/apps/dashboard/DashboardService";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SelectModule } from 'ng2-select';

@NgModule({
  imports: [
    DashboardRoutingModule,
    ChartsModule,
    CommonModule,

    SimpleNotificationsModule,
    PushNotificationsModule,

    LaddaModule,
    // DataTableModule,
    TextMaskModule,
    BsDropdownModule,

    PipesModule,

    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28",
      libraries: ["places,drawing"]
    }),

    ToasterModule,
    SelectModule
  ],
  providers: [DashboardService],
  bootstrap: [DashboardComponent, BillsComponent, BillDetailComponent, BillLocationComponent],
  declarations: [DashboardComponent, BillsComponent, BillDetailComponent, BillLocationComponent]
})
export class DashboardModule { }
