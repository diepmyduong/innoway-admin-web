import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import * as layout from './layouts'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  layout.SimpleLayoutRouting,
  layout.FullLayoutRouting,
  layout.ChatbotLayoutRouting,
  layout.LauncherLayoutRouting,
  layout.PosLayoutRouting,
  layout.ChatGutLayoutRouting,
  // {
  //   path: '**',
  //   redirectTo: '404'
  // }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
