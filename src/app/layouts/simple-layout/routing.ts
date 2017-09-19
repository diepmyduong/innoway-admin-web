import { SimpleLayoutComponent } from './simple-layout.component'

export const SimpleLayoutRouting = {
    path: '',
    component: SimpleLayoutComponent,
    loadChildren: 'app/pages/pages.module#PagesModule'
}