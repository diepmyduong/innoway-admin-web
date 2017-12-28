import { IntegrateKiotvietLayoutComponent } from './integrate-kiotviet-layout.component'
import { AuthGuard } from 'app/services'

export const IntegrateKiotVietLayoutRouting = {
  path: 'brand-layout',
  component: IntegrateKiotvietLayoutComponent,
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
