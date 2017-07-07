import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { p404Component } from './404.component';
import { p500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ChatbotLoginComponent } from './chatbot-login.component';
import { UnAuthGuard } from '../chatbot/services/auth.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo: '404',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Example Pages'
    },
    children: [
      {
        path: '404',
        component: p404Component,
        data: {
          title: 'Page 404'
        }
      },
      {
        path: '500',
        component: p500Component,
        data: {
          title: 'Page 500'
        }
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'chatbot-login',
        component: ChatbotLoginComponent,
        canActivate: [UnAuthGuard]
      }
      // {
      //   path: 'register',
      //   component: RegisterComponent,
      //   data: {
      //     title: 'Register Page'
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
