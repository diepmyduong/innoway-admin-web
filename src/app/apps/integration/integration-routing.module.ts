import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatbotComponent } from "./chatbot/chatbot.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chatbot',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Thirdparty'
    },
    children:[
      {
        path: 'chatbot',
        component: ChatbotComponent,
        data: {
          title: "Chatbot"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationRoutingModule { }
