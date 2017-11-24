import { SettingLayoutComponent } from './setting-layout.component'
import { AuthGuard } from 'app/services'

export const SettingLayoutRouting = {
  path: 'setting-layout',
  component: SettingLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'setting',
      pathMatch: 'full',
    },
    {
      path: 'setting',
      loadChildren: 'app/apps/setting/setting.module#SettingModule'
    }
  ],

}
