import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BillsComponent } from './bills/bills.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    ChartsModule
  ],
  declarations: [ DashboardComponent, BillsComponent, BillDetailComponent ]
})
export class DashboardModule { }
