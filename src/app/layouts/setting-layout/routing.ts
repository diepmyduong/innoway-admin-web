import { SettingLayoutComponent } from './setting-layout.component'
import { AuthGuard } from 'app/services'

export const SettingLayoutRouting = {
  path: 'setting-layout',
  component: SettingLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'ship',
      pathMatch: 'full',
    },
    {
      path: 'settings',
      loadChildren: 'app/apps/settings/settings.module#SettingsModule'
    },
    {
      path: 'ship',
      loadChildren: 'app/apps/ship/ship.module#ShipModule'
    },
    {
      path: 'area',
      loadChildren: 'app/apps/area/area.module#AreaModule'
    },
    {
      path: 'integration',
      loadChildren: 'app/apps/integration/integration.module#IntegrationModule'
    }
  ],

}
