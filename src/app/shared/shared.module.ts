import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterModule } from '@angular/router';
import { Ng2DragDropModule } from 'ng2-drag-drop';

import { BreadcrumbsComponent } from './breadcrumb.component'
import { AsideToggleDirective } from './aside.directive'
import { NAV_DROPDOWN_DIRECTIVES} from './nav-dropdown.directive'
import { SIDEBAR_TOGGLE_DIRECTIVES} from './sidebar.directive'
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule,
    TabsModule,
    RouterModule,
    Ng2DragDropModule.forRoot(),
  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    NavbarComponent
  ],
  exports: [
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    TabsModule,
    RouterModule,
    Ng2DragDropModule,
    NavbarComponent
  ]
})
export class SharedModule { }
