import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartCodeRoutingModule } from './smart-code-routing.module';
import { SmartCodeComponent } from './smart-code.component';
import { AddComponent } from './add/add.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from 'app/pipes/pipes.module'

import { FroalaComponent } from "app/editor/froala.component";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  imports: [
    CommonModule,
    SmartCodeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),

    PipesModule
  ],
  declarations: [SmartCodeComponent, AddComponent, FroalaComponent]
})
export class SmartCodeModule { }
