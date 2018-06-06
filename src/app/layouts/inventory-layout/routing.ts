import { InventoryLayoutComponent } from './inventory-layout.component'
import { AuthGuard } from 'app/services'

export const InventoryLayoutRouting = {
  path: 'inventory-layout',
  component: InventoryLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'import-history',
      pathMatch: 'full',
    },
    {
      path: 'export-history',
      loadChildren: 'app/apps/export-history/export-history.module#ExportHistoryModule'
    },
    {
      path: 'import-history',
      loadChildren: 'app/apps/import-history/import-history.module#ImportHistoryModule'
    },
    {
      path: 'products',
      loadChildren: 'app/apps/products/products.module#ProductsModule'
    }, {
      path: 'store',
      loadChildren: 'app/apps/store/store.module#StoreModule'
    },
    {
      path: 'supplier',
      loadChildren: 'app/apps/supplier/supplier.module#SupplierModule'
    },
    {
      path: 'supplier-category',
      loadChildren: 'app/apps/supplier-category/supplier-category.module#SupplierCategoryModule'
    },
  ],

}
