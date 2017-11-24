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
      path: 'promotion-type',
      loadChildren: 'app/apps/promotion-type/promotion-type.module#PromotionTypeModule'
    }
  ],

}
