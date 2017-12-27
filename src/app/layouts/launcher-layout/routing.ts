import { LauncherLayoutComponent } from './launcher-layout.component'
import { AuthGuard } from "app/services";

export const LauncherLayoutRouting = {
  path: 'launcher',
  component: LauncherLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'tool',
      pathMatch: 'full',
    },
    {
      path: 'tool',
      loadChildren: 'app/apps/tool/tool.module#ToolModule'
    },
    {
      path: 'brand-register',
      loadChildren: 'app/apps/brand-register/brand-register.module#BrandRegisterModule'
    }
  ]
}
