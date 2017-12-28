import { ReportLayoutComponent } from './report-layout.component'
import { AuthGuard } from 'app/services'

export const ReportLayoutRouting = {
  path: 'brand-layout',
  component: ReportLayoutComponent,
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
