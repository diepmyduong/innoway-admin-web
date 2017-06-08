import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillComponent } from './bill.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bill',
    pathMatch: 'full'
  },
  {
    path: '',
    component: BillComponent,
    data: {
      title: 'Đơn hàng'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
