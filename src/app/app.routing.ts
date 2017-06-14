import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Trang chủ'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'products',
        loadChildren: './products/products.module#ProductsModule'
      },
      {
        path: 'unit',
        loadChildren: './unit/unit.module#UnitModule'
      },
      {
        path: 'topping',
        loadChildren: './topping/topping.module#ToppingModule'
      },
      {
        path: 'topping-type',
        loadChildren: './topping-type/topping-type.module#ToppingTypeModule'
      },
      {
        path: 'employee',
        loadChildren: './employee/employee.module#EmployeeModule'
      },
      {
        path: 'employee-type',
        loadChildren: './employee-type/employee-type.module#EmployeeTypeModule'
      },
      {
        path: 'product-type',
        loadChildren: './product-type/product-type.module#ProductTypeModule'
      },
      {
        path: 'bill',
        loadChildren: './bill/bill.module#BillModule'
      },
      {
        path: 'attribute',
        loadChildren: './attribute/attribute.module#AttributeModule'
      },
      {
        path: 'promotion',
        loadChildren: './promotion/promotion.module#PromotionModule'
      },
      {
        path: 'notification',
        loadChildren: './notification/notification.module#NotificationModule'
      },
      {
        path: 'notification-type',
        loadChildren: './notification-type/notification-type.module#NotificationTypeModule'
      },
      {
        path: 'blog',
        loadChildren: './blog/blog.module#BlogModule'
      },
      {
        path: 'blog-type',
        loadChildren: './blog-type/blog-type.module#BlogTypeModule'
      },
      {
        path: 'customer',
        loadChildren: './customer/customer.module#CustomerModule'
      },
      {
        path: 'customer-type',
        loadChildren: './customer-type/customer-type.module#CustomerTypeModule'
      },
      {
        path: 'report',
        loadChildren: './report/report.module#ReportModule'
      },
      {
        path: 'summary',
        loadChildren: './summary/summary.module#SummaryModule'
      },
      {
        path: 'feedback',
        loadChildren: './feedback/feedback.module#FeedbackModule'
      },
      {
        path: 'feedback-rule',
        loadChildren: './feedback-rule/feedback-rule.module#FeedbackRuleModule'
      },
      {
        path: 'ship-fee',
        loadChildren: './ship-fee/ship-fee.module#ShipFeeModule'
      },
      {
        path: 'ship-fee-type',
        loadChildren: './ship-fee-type/ship-fee-type.module#ShipFeeTypeModule'
      },
      {
        path: 'schedule',
        loadChildren: './schedule/schedule.module#ScheduleModule'
      },
      {
        path: 'blacklist',
        loadChildren: './blacklist/blacklist.module#BlacklistModule'
      },
      {
        path: 'blacklist-rule',
        loadChildren: './blacklist-rule/blacklist-rule.module#BlacklistRuleModule'
      },
      {
        path: 'brand',
        loadChildren: './brand/brand.module#BrandModule'
      },
      {
        path: 'brand-type',
        loadChildren: './brand-type/brand-type.module#BrandTypeModule'
      },
      {
        path: 'branch',
        loadChildren: './branch/branch.module#BranchModule'
      },
      {
        path: 'branch-type',
        loadChildren: './branch-type/branch-type.module#BranchTypeModule'
      },
      {
        path: 'service',
        loadChildren: './service/service.module#ServiceModule'
      },
      {
        path: 'chatbot',
        loadChildren: './chatbot/chatbot.module#ChatbotModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        path: 'area',
        loadChildren: './area/area.module#AreaModule'
      },
      {
        path: 'ship-fee',
        loadChildren: './ship-fee/ship-fee.module#ShipFeeModule'
      },
    ]
  },
  {
    path: 'pages',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './pages/pages.module#PagesModule',
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
