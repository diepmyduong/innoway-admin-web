import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogTypeRoutingModule } from './blog-type-routing.module';
import { BlogTypeComponent } from './blog-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { PipesModule } from 'app/pipes/pipes.module'
import { SwiperModule } from 'angular2-useful-swiper';

import { QuillEditorModule } from "ngx-quill-editor";
import { Ng4JsonEditorModule } from "angular4-jsoneditor";

// import { FroalaComponent } from "app/editor/froala.component";
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
@NgModule({
  imports: [
    CommonModule,
    BlogTypeRoutingModule,

    FormsModule,
    LaddaModule,

    DataTableModule,
    TextMaskModule,

    PipesModule,

    QuillEditorModule,
    Ng4JsonEditorModule
  ],
  declarations: [BlogTypeComponent, AddComponent, DetailComponent]
})
export class BlogTypeModule { }
