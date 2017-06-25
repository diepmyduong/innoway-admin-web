import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatbotComponent } from './chatbot.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Chatbot'
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
        }
      },
      {
        path: 'dashboard',
        redirectTo: 'dashboard/settings',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: "Điều hướng"
        },
        children: [
          {
            path: 'settings',
            component: SettingsComponent,
            data: {
              title: "Cài đặt"
            }
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
