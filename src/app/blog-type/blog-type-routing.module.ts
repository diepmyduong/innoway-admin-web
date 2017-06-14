import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { BlogTypeComponent } from './blog-type.component';
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
      title: 'BlogType'
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
        path: 'list',
        component: BlogTypeComponent,
        data: {
          title: "Danh sách"
        }
      },
      {
        path: 'detail',
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
export class BlogTypeRoutingModule {}
