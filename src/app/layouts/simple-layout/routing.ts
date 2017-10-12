import { SimpleLayoutComponent } from './simple-layout.component'

export const SimpleLayoutRouting = {
    path: '',
    component: SimpleLayoutComponent,
    loadChildren: 'app/pages/pages.module#PagesModule'
}

export const PosLayoutRouting = {
    path: 'pos',
    component: SimpleLayoutComponent,
    loadChildren: 'app/apps/pos/pos.module#PosModule'
}