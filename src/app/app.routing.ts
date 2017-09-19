import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { 
  FullLayoutRouting,
  SimpleLayoutRouting,
  ChatbotLayoutRouting,
  LauncherLayoutRouting
} from './layouts'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  SimpleLayoutRouting,
  FullLayoutRouting,
  ChatbotLayoutRouting,
  LauncherLayoutRouting
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
