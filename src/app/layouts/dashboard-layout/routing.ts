import { DashboardLayoutComponent } from './dashboard-layout.component'
import { AuthGuard } from 'app/services'

export const DashboardLayoutRouting = {
  path: 'dashboard-layout',
  component: DashboardLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      loadChildren: 'app/apps/dashboard/dashboard.module#DashboardModule'
    },
    {
      path: 'bill',
      loadChildren: 'app/apps/bill/bill.module#BillModule'
    }
  ],

}
