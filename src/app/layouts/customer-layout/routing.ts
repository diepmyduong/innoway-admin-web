import { CustomerLayoutComponent } from './customer-layout.component'
import { AuthGuard } from 'app/services'

export const CustomerLayoutRouting = {
  path: 'customer-layout',
  component: CustomerLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'customer',
      pathMatch: 'full',
    },
    {
      path: 'customer',
      loadChildren: 'app/apps/customer/customer.module#CustomerModule'
    }
  ],

}
