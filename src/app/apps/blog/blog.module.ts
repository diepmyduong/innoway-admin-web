import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { PipesModule } from 'app/pipes/pipes.module'
import { SwiperModule } from 'angular2-useful-swiper';

import { QuillEditorModule } from 'ngx-quill-editor';

import { Ng4JsonEditorModule } from 'angular4-jsoneditor'

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,

    FormsModule,
    LaddaModule,

    DataTableModule,
    TextMaskModule,

    PipesModule,


    QuillEditorModule,
    Ng4JsonEditorModule
  ],
  declarations: [BlogComponent, DetailComponent, AddComponent]
})
export class BlogModule { }
