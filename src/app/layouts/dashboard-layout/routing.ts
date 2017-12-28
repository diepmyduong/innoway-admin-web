import { DashboardLayoutComponent } from './dashboard-layout.component'
import { AuthGuard } from 'app/services'

export const DashboardLayoutRouting = {
  path: 'brand-layout',
  component: DashboardLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'brand/list',
      pathMatch: 'full',
    },
    {
      path: 'brand',
      loadChildren: 'app/apps/brand/brand.module#brandModule'
    }
  ],

}
