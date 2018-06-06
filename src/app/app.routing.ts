import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

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
  layout.BranchLayoutRouting,
  layout.InventoryLayoutRouting,
  layout.TicketLayoutRouting,
  layout.BillLayoutRouting,
  layout.BlogLayoutRouting,
  layout.DashboardLayoutRouting,
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
