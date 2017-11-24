import { BillLayoutComponent } from './bill-layout.component'
import { AuthGuard } from 'app/services'

export const BillLayoutRouting = {
  path: 'bill-layout',
  component: BillLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'bill',
      pathMatch: 'full',
    },
    {
      path: 'bill',
      loadChildren: 'app/apps/bill/bill.module#BillModule'
    }
  ],

}
