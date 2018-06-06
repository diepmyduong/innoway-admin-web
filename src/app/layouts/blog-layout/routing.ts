import { BlogLayoutComponent } from './blog-layout.component'
import { AuthGuard } from 'app/services'

export const BlogLayoutRouting = {
  path: 'blog-layout',
  component: BlogLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'blog',
      pathMatch: 'full',
    },
    {
      path: 'blog',
      loadChildren: 'app/apps/blog/blog.module#BlogModule'
    },
    {
      path: 'blog-type',
      loadChildren: 'app/apps/blog-type/blog-type.module#BlogTypeModule'
    }
  ],

}
