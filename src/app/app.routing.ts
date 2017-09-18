import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { ChatbotLayoutComponent } from './layouts/chatbot-layout/chatbot-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: './pages/pages.module#PagesModule'
  },
  {
    path: 'app',
    loadChildren: './apps/apps-routing.module#AppsModule'
  },
  // {
  //   path: 'chatbot',
  //   component: ChatbotLayoutComponent,
  //   data: {
  //     title: 'Chat bot'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: './chatbot/chatbot.module#ChatbotModule'
  //     },
  //   ]
    
  // },
  {
    path: '**', 
    redirectTo: '404'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
