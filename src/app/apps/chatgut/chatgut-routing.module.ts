import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ChatgutComponent } from './chatgut.component'
import { ChatbotAuthGuard } from 'app/services'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'ChatGut'
    },
    component: ChatgutComponent,
    canActivate: [ChatbotAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatgutRoutingModule { }
