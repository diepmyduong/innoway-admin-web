import { BrandLayoutComponent } from './brand-layout.component'
import { AuthGuard } from 'app/services'

export const BrandLayoutRouting = {
  path: 'brand-layout',
  component: BrandLayoutComponent,
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
