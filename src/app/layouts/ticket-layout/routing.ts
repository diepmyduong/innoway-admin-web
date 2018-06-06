import { TicketLayoutComponent } from './ticket-layout.component'
import { AuthGuard } from 'app/services'

export const TicketLayoutRouting = {
  path: 'ticket-layout',
  component: TicketLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'ticket',
      pathMatch: 'full',
    },
    {
      path: 'ticket',
      loadChildren: 'app/apps/ticket/ticket.module#TicketModule'
    }
  ],

}
