import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryComponent } from './summary.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SummaryComponent,
    data: {
      title: 'Thống kê'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryRoutingModule { }
