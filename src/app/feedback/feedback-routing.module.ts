import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { FeedbackComponent } from './feedback.component';
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
      title: 'Phản hồi'
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
        component: FeedbackComponent,
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
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule {}
