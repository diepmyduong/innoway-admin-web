import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillComponent } from './bill.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { PaidComponent } from './paid/paid.component';
import { PaidListComponent } from "app/apps/bill/paid-list/paid-list.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Đơn hàng'
    },
    children: [
      {
        path: 'add/:id',
        component: AddComponent,
        data: {
          title: "Thêm"
        }
      },
      {
        path: 'list',
        component: BillComponent,
        data: {
          title: "Danh sách"
        }
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        data: {
          title: "Chi tiết"
        }
      },
      {
        path: 'paid/:id',
        component: PaidComponent,
        data: {
          title: "Chi tiết"
        },
      },
      {
        path: 'paid-list/:id',
        component: PaidListComponent
        ,
        data: {
          title: "Chi tiết"
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
