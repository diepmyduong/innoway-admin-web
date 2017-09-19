import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from './report.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'report',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ReportComponent,
    data: {
      title: 'Báo cáo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
