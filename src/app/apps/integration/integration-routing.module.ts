import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { KiotvietComponent } from "app/apps/integration/kiotviet/kiotviet.component";
import { HaravanComponent } from "app/apps/integration/haravan/haravan.component";
import { GiaohangnhanhComponent } from "app/apps/integration/giaohangnhanh/giaohangnhanh.component";
import { GhtkComponent } from "app/apps/integration/ghtk/ghtk.component";

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
      },
      {
        path: 'haravan',
        component: HaravanComponent,
        data: {
          title: "Haravan"
        }
      },
      {
        path: 'kiotviet',
        component: KiotvietComponent,
        data: {
          title: "KiotViet"
        }
      },
      {
        path: 'ghn',
        component: GiaohangnhanhComponent,
        data: {
          title: "Giao hàng nhanh"
        }
      },
      {
        path: 'ghtk',
        component: GhtkComponent,
        data: {
          title: "Giao hàng tiết kiệm"
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
