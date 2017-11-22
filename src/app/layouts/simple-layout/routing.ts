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

export const BrandRegisterLayoutRouting = {
  path: 'brand-register',
  component: SimpleLayoutComponent,
  canActivate: [AuthGuard],
  loadChildren: 'app/apps/brand-register/brand-register.module#BrandRegisterModule'
}

export const ToolLayoutRouting = {
  path: 'tool',
  component: SimpleLayoutComponent,
  canActivate: [AuthGuard],
  loadChildren: 'app/apps/tool/tool.module#ToolModule'
}
