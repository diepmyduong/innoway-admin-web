import { FullLayoutComponent } from './full-layout.component'
import { AuthGuard } from 'app/services'

export const FullLayoutRouting = {
  path: 'super-admin',
  component: FullLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      loadChildren: 'app/apps/dashboard/dashboard.module#DashboardModule'
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
    },
    {
      path: 'employee',
      loadChildren: 'app/apps/employee/employee.module#EmployeeModule'
    },
    {
      path: 'product-type',
      loadChildren: 'app/apps/product-type/product-type.module#ProductTypeModule'
    },
    {
      path: 'category',
      loadChildren: 'app/apps/category/category.module#CategoryModule'
    },
    {
      path: 'bill',
      loadChildren: 'app/apps/bill/bill.module#BillModule'
    },
    // {
    //   path: 'attribute',
    //   loadChildren: 'app/apps/attribute/attribute.module#AttributeModule'
    // },
    {
      path: 'promotion',
      loadChildren: 'app/apps/promotion/promotion.module#PromotionModule'
    },
    // {
    //   path: 'promotion-type',
    //   loadChildren: 'app/apps/promotion-type/promotion-type.module#PromotionTypeModule'
    // },
    // {
    //   path: 'notification',
    //   loadChildren: 'app/apps/notification/notification.module#NotificationModule'
    // },
    // {
    //   path: 'notification-type',
    //   loadChildren: 'app/apps/notification-type/notification-type.module#NotificationTypeModule'
    // },
    // {
    //   path: 'blog',
    //   loadChildren: 'app/apps/blog/blog.module#BlogModule'
    // },
    // {
    //   path: 'blog-type',
    //   loadChildren: 'app/apps/blog-type/blog-type.module#BlogTypeModule'
    // },
    {
      path: 'customer',
      loadChildren: 'app/apps/customer/customer.module#CustomerModule'
    },
    {
      path: 'customer-type',
      loadChildren: 'app/apps/customer-type/customer-type.module#CustomerTypeModule'
    },
    // {
    //   path: 'report',
    //   loadChildren: 'app/apps/report/report.module#ReportModule'
    // },
    // {
    //   path: 'summary',
    //   loadChildren: 'app/apps/summary/summary.module#SummaryModule'
    // },
    // {
    //   path: 'feedback',
    //   loadChildren: 'app/apps/feedback/feedback.module#FeedbackModule'
    // },
    // {
    //   path: 'feedback-rule',
    //   loadChildren: 'app/apps/feedback-rule/feedback-rule.module#FeedbackRuleModule'
    // },
    {
      path: 'ship',
      loadChildren: 'app/apps/ship/ship.module#ShipModule'
    },
    // {
    //   path: 'schedule',
    //   loadChildren: 'app/apps/schedule/schedule.module#ScheduleModule'
    // },
    // {
    //   path: 'deposit',
    //   loadChildren: 'app/apps/deposit/deposit.module#DepositModule'
    // },
    {
      path: 'pos',
      loadChildren: 'app/apps/pos/pos.module#PosModule'
    },
    // {
    //   path: 'paid-history',
    //   loadChildren: 'app/apps/paid-history/paid-history.module#PaidHistoryModule'
    // },
    // {
    //   path: 'blacklist',
    //   loadChildren: 'app/apps/blacklist/blacklist.module#BlacklistModule'
    // },
    // {
    //   path: 'blacklist-rule',
    //   loadChildren: 'app/apps/blacklist-rule/blacklist-rule.module#BlacklistRuleModule'
    // },
    {
      path: 'brand',
      loadChildren: 'app/apps/brand/brand.module#BrandModule'
    },
    {
      path: 'brand-category',
      loadChildren: 'app/apps/brand-category/brand-category.module#BrandCategoryModule'
    },
    {
      path: 'branch',
      loadChildren: 'app/apps/branch/branch.module#BranchModule'
    },
    {
      path: 'branch-type',
      loadChildren: 'app/apps/branch-type/branch-type.module#BranchTypeModule'
    },
    // {
    //   path: 'service',
    //   loadChildren: 'app/apps/service/service.module#ServiceModule'
    // },
    {
      path: 'settings',
      loadChildren: 'app/apps/settings/settings.module#SettingsModule'
    },
    // {
    //   path: 'schedule',
    //   loadChildren: 'app/apps/schedule/schedule.module#ScheduleModule'
    // },
    {
      path: 'area',
      loadChildren: 'app/apps/area/area.module#AreaModule'
    },
    {
      path: 'brand-register',
      loadChildren: 'app/apps/brand-register/brand-register.module#BrandRegisterModule'
    }, {
      path: 'tool',
      loadChildren: 'app/apps/tool/tool.module#ToolModule'
    }, {
      path: 'integration',
      loadChildren: 'app/apps/integration/integration.module#IntegrationModule'
    },
    {
      path: 'smart-code',
      loadChildren: 'app/apps/smart-code/smart-code.module#SmartCodeModule'
    },
  ],

}
