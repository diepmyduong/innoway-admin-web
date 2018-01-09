import { PromotionLayoutComponent } from './promotion-layout.component'
import { AuthGuard } from 'app/services'

export const PromotionLayoutRouting = {
  path: 'promotion-layout',
  component: PromotionLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'promotion',
      pathMatch: 'full',
    },
    {
      path: 'promotion',
      loadChildren: 'app/apps/promotion/promotion.module#PromotionModule'
    },
    {
      path: 'customer-type',
      loadChildren: 'app/apps/customer-type/customer-type.module#CustomerTypeModule'
    },
    {
      path: 'smart-code',
      loadChildren: 'app/apps/smart-code/smart-code.module#SmartCodeModule'
    }
  ],

}
