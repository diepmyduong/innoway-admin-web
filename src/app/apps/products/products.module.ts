import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { AddComponent } from './add/add.component';

import { DetailComponent } from './detail/detail.component';
import { VSChecklistModule } from 'ng2-vs-checklist';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { CustomFormsModule } from 'ng2-validation';

// import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';

// Ng2-select
import { SelectModule } from 'ng2-select';

import { ModalModule as CustomModal} from 'app/modal/modal.module';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { PipesModule } from 'app/pipes/pipes.module'
import { SwiperModule } from 'angular2-useful-swiper';

import { ToppingDetailComponent } from './topping-detail/topping-detail.component';
import { MatCheckboxModule, MatTooltipModule } from "@angular/material";
import { QuillEditorModule } from "ngx-quill-editor";
import { Ng4JsonEditorModule } from "angular4-jsoneditor";
import { TooltipModule, BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    VSChecklistModule,
    AngularMultiSelectModule,
    TextMaskModule,
    SimpleNotificationsModule,
    PushNotificationsModule,
    CustomFormsModule,
    SelectModule,
    ModalModule.forRoot(),
    CustomModal,
    LaddaModule,
    DataTableModule,
    PipesModule,
    SwiperModule,
    MatCheckboxModule,
    MatTooltipModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),

    QuillEditorModule,
    Ng4JsonEditorModule
  ],
  declarations: [ProductsComponent, AddComponent, DetailComponent, ToppingDetailComponent],  //UploadImageByUrlComponent
  providers: []
})
export class ProductsModule { }
