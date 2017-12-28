import { LicenseLayoutComponent } from './license-layout.component'
import { AuthGuard } from 'app/services'

export const LicenseLayoutRouting = {
  path: 'brand-layout',
  component: LicenseLayoutComponent,
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
