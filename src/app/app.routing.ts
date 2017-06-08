import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

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
        path: 'employee',
        loadChildren: './employee/employee.module#EmployeeModule'
      },
      {
        path: 'bill',
        loadChildren: './bill/bill.module#BillModule'
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
        path: 'blog',
        loadChildren: './blog/blog.module#BlogModule'
      },
      {
        path: 'customer',
        loadChildren: './customer/customer.module#CustomerModule'
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
        path: 'chatbot',
        loadChildren: './chatbot/chatbot.module#ChatbotModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
