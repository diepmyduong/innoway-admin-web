import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './breadcrumb.component'
import { AsideToggleDirective } from './aside.directive'
import { NAV_DROPDOWN_DIRECTIVES} from './nav-dropdown.directive'
import { SIDEBAR_TOGGLE_DIRECTIVES} from './sidebar.directive'

@NgModule({
  imports: [
    CommonModule,
    TabsModule,
    RouterModule,
  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
  ],
  exports: [
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    TabsModule,
    RouterModule,
  ]
})
export class SharedModule { }
