import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatbotComponent } from './chatbot.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { StoryComponent } from './story/story.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthGuard } from './services/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Điều hướng'
    },
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: "Kết nối với tài khoản Facebook"
        }
      },
      {
        path: 'pages',
        component: ChatbotComponent,
        data: {
          title: "Danh sách trang"
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard/:pid',
        redirectTo: 'dashboard/:pid/settings',
        pathMatch: 'full',
      },
      {
        path: 'dashboard/:pid',
        component: DashboardComponent,
        children: [
          {
            path: 'settings',
            component: SettingsComponent,
            data: {
              title: "Cài đặt"
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'stories',
            component: StoryComponent,
            data: {
              title: "Stories"
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'subscribers',
            component: SubscribersComponent,
            data: {
              title: "Khách hàng"
            },
            canActivate: [AuthGuard]
          },
          {
            path: 'notification',
            component: NotificationComponent,
            data: {
              title: "Thông báo"
            },
            canActivate: [AuthGuard]
          },
          {
            path: '**', 
            redirectTo: '/pages/404'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatbotRoutingModule { }
