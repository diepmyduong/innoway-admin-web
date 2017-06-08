import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackComponent } from './feedback.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'feedback',
    pathMatch: 'full'
  },
  {
    path: '',
    component: FeedbackComponent,
    data: {
      title: 'Phản hồi'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
