import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { BillsComponent } from './bills/bills.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bills',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Trang điều hướng'
    },
    children: [
      {
        path: 'bills',
        component: BillsComponent
      },
      {
        path: 'bills/:id',
        component: BillDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
