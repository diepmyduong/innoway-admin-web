import { IntegrateChatbotLayoutComponent } from './integrate-chatbot-layout.component'
import { AuthGuard } from 'app/services'

export const IntegrateChatbotLayoutRouting = {
  path: 'brand-layout',
  component: IntegrateChatbotLayoutComponent,
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
