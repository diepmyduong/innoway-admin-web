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
      path: 'topping-type',
      loadChildren: 'app/apps/topping-type/topping-type.module#ToppingTypeModule'
    }
  ],

}
