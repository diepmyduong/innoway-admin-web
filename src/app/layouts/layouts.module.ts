import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared'

import { SimpleLayoutComponent } from './simple-layout/simple-layout.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { ChatbotLayoutComponent } from './chatbot-layout/chatbot-layout.component';
import { LauncherLayoutComponent } from './launcher-layout/launcher-layout.component';

import { BsDropdownModule } from 'ng2-bs-dropdown';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    BsDropdownModule
  ],
  declarations: [SimpleLayoutComponent, FullLayoutComponent, ChatbotLayoutComponent, LauncherLayoutComponent]
})
export class LayoutsModule { }
