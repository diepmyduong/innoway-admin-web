import { SummaryLayoutComponent } from './summary-layout.component'
import { AuthGuard } from 'app/services'

export const SummaryLayoutRouting = {
  path: 'brand-layout',
  component: SummaryLayoutComponent,
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
