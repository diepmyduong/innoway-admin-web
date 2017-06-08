import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotionComponent } from './promotion.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'promotion',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PromotionComponent,
    data: {
      title: 'Khuyến mãi'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
