import { BranchLayoutComponent } from './branch-layout.component'
import { AuthGuard } from 'app/services'

export const BranchLayoutRouting = {
  path: 'branch-layout',
  component: BranchLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'branch/list',
      pathMatch: 'full',
    },
    {
      path: 'branch',
      loadChildren: 'app/apps/branch/branch.module#BranchModule'
    }
  ],

}
