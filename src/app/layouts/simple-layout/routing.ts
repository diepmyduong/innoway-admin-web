import { SimpleLayoutComponent } from './simple-layout.component'
import { AuthGuard } from 'app/services'

export const SimpleLayoutRouting = {
  path: '',
  component: SimpleLayoutComponent,
  loadChildren: 'app/pages/pages.module#PagesModule'
}

export const PosLayoutRouting = {
  path: 'pos',
  component: SimpleLayoutComponent,
  canActivate: [AuthGuard],
  loadChildren: 'app/apps/pos/pos.module#PosModule'
}

export const ChatGutLayoutRouting = {
  path: 'mcommerce',
  component: SimpleLayoutComponent,
  loadChildren: 'app/apps/chatgut/chatgut.module#ChatgutModule'
}
