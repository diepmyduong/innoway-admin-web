import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import * as layout from './layouts'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  layout.SimpleLayoutRouting,
  layout.FullLayoutRouting,
  layout.LauncherLayoutRouting,
  layout.PosLayoutRouting,
  layout.BrandRegisterLayoutRouting,
  layout.ToolLayoutRouting,
  layout.ProductLayoutRouting,
  layout.CustomerLayoutRouting,
  layout.EmployeeLayoutRouting,
  layout.SettingLayoutRouting,
  layout.PromotionLayoutRouting,
  layout.BillLayoutRouting,
  layout.BranchLayoutRouting
  // {
  //   path: '**',
  //   redirectTo: '404'
  // }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
