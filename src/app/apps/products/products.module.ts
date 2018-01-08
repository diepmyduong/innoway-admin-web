import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { DetailComponent } from './detail/detail.component';
import { VSChecklistModule } from 'ng2-vs-checklist';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { CustomFormsModule } from 'ng2-validation';

// import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';

// Ng2-select
import { SelectModule } from 'ng2-select';

import { UploadImageByUrlComponent } from 'app/modal/upload-image-by-url/upload-image-by-url.component';

import { ModalModule as Ng2ModalModule } from 'angular2-modal';
import { ModalModule as CustomModal} from 'app/modal/modal.module';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';
import { TextMaskModule } from 'angular2-text-mask';

import { PipesModule } from 'app/pipes/pipes.module'
import { SwiperModule } from 'angular2-useful-swiper';

import { FroalaComponent } from "app/editor/froala.component";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

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
    FroalaEditorModule,
    FroalaViewModule,
    // UploadImageByUrlComponent
  ],
  declarations: [ProductsComponent, AddComponent, DetailComponent],  //UploadImageByUrlComponent
  providers: []
})
export class ProductsModule { }
