import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { SelectModule } from 'ng2-select';
import { SharedModule } from 'app/shared'
import { PaginationModule, ButtonsModule } from 'ngx-bootstrap';
import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatGridListModule,
  MatTableModule,
  MatInputModule,
  MatAutocompleteModule,
  MatCardModule,
  MatOptionModule,
  MatFormFieldModule,
  MatDialogModule,
  MatCheckboxModule,
  MatRadioModule,
  MatPseudoCheckboxModule,
} from '@angular/material'

import { PosRoutingModule } from './pos-routing.module';
import { ToppingDialog } from './topping-dialog.component';
import { PosComponent, CheckboxToppingChecklistComponent } from './pos.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from 'app/pipes/pipes.module';

import { ToasterModule, ToasterService } from 'angular2-toaster/angular2-toaster';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { AgmCoreModule } from "@agm/core";
import { DataTableModule } from "angular-2-data-table-bootstrap4";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PosRoutingModule,
    SidebarModule,
    NgbModule,
    DataTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatTableModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule,
    MatOptionModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatPseudoCheckboxModule,
    TabsModule,
    TextMaskModule,
    PipesModule,
    ToasterModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    SelectModule,
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28",
      libraries: ["places,drawing"],
      language: 'vi-VN'
    }),
  ],
  entryComponents: [PosComponent, ToppingDialog, CheckboxToppingChecklistComponent],
  declarations: [PosComponent, ToppingDialog, CheckboxToppingChecklistComponent],
})
export class PosModule { }
