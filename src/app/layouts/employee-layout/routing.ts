import { EmployeeLayoutComponent } from './employee-layout.component'
import { AuthGuard } from 'app/services'

export const EmployeeLayoutRouting = {
  path: 'employee-layout',
  component: EmployeeLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'employee-layout',
      redirectTo: 'employee',
      pathMatch: 'full',
    },
    {
      path: 'employee',
      loadChildren: 'app/apps/employee/employee.module#EmployeeModule'
    }
  ],

}
