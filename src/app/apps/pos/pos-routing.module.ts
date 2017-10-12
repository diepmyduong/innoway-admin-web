import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosComponent } from './pos.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'POS'
    },
    component: PosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
