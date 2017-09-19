import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { AreaComponent } from './area/area.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SellComponent } from './sell/sell.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Thiếp lập'
    },
    children:[
      {
        path: 'area',
        component: AreaComponent,
        data: {
          title: "Khu vực hoạt động"
        }
      },
      {
        path: 'chatbot',
        component: ChatbotComponent,
        data: {
          title: "Thiết lập chatbot"
        }
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
        data: {
          title: "Thời gian hoạt động"
        }
      },
      {
        path: 'sell',
        component: SellComponent,
        data: {
          title: "Thiết lập bán hàng"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
