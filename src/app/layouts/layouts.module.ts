import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared'

import { SimpleLayoutComponent } from './simple-layout/simple-layout.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { LauncherLayoutComponent } from './launcher-layout/launcher-layout.component';

//import { BsDropdownModule } from 'ng2-bs-dropdown';
// Notifications
import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';
import { ProductLayoutComponent } from "./product-layout/product-layout.component";
import { EmployeeLayoutComponent } from './employee-layout/employee-layout.component';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { BillLayoutComponent } from './bill-layout/bill-layout.component';
import { SettingLayoutComponent } from './setting-layout/setting-layout.component';
import { PromotionLayoutComponent } from './promotion-layout/promotion-layout.component';
import { BranchLayoutComponent } from './branch-layout/branch-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    //BsDropdownModule,
    ToasterModule
  ],
  declarations: [SimpleLayoutComponent, FullLayoutComponent, LauncherLayoutComponent, ProductLayoutComponent, EmployeeLayoutComponent, CustomerLayoutComponent, BillLayoutComponent, SettingLayoutComponent, PromotionLayoutComponent, BranchLayoutComponent]
})
export class LayoutsModule { }
