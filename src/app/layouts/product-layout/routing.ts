import { ProductLayoutComponent } from './product-layout.component'
import { AuthGuard } from 'app/services'

export const ProductLayoutRouting = {
  path: 'product-layout',
  component: ProductLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'products',
      pathMatch: 'full',
    },
    {
      path: 'products',
      loadChildren: 'app/apps/products/products.module#ProductsModule'
    },
    {
      path: 'unit',
      loadChildren: 'app/apps/unit/unit.module#UnitModule'
    },
    {
      path: 'topping',
      loadChildren: 'app/apps/topping/topping.module#ToppingModule'
    },
    {
      path: 'product-type',
      loadChildren: 'app/apps/product-type/product-type.module#ProductTypeModule'
    },
    {
      path: 'category',
      loadChildren: 'app/apps/category/category.module#CategoryModule'
    },

  ],

}
