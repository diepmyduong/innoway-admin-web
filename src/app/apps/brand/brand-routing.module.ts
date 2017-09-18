import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { BrandComponent } from './brand.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Thương hiệu'
    },
    children:[
      {
        path: 'add',
        component: AddComponent,
        data: {
          title: "Thêm"
        }
      },
      {
        path: 'add/:id',
        component: AddComponent,
        data: {
          title: "Cập nhật"
        }
      },
      {
        path: 'list',
        component: BrandComponent,
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule {}
