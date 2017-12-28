import { FeedbackLayoutComponent } from './feedback-layout.component'
import { AuthGuard } from 'app/services'

export const FeedbackLayoutRouting = {
  path: 'feedback-layout',
  component: FeedbackLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'feedback/list',
      pathMatch: 'full',
    },
    {
      path: 'feedback',
      loadChildren: 'app/apps/feedback/feedback.module#feedbackModule'
    }
  ],

}
