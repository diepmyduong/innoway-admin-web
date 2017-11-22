import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandRegisterComponent } from "app/apps/brand-register/brand-register.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Đăng ký'
    },
    component: BrandRegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRegisterRoutingModule { }
