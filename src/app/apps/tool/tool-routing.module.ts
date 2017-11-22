import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolComponent } from "app/apps/tool/tool.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tính năng'
    },
    component: ToolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolRoutingModule { }
