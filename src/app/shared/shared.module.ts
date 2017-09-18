import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbsComponent } from './breadcrumb.component'
import { AsideToggleDirective } from './aside.directive'
import { NAV_DROPDOWN_DIRECTIVES} from './nav-dropdown.directive'
import { SIDEBAR_TOGGLE_DIRECTIVES} from './sidebar.directive'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
  ]
})
export class SharedModule { }
