import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { AddComponent } from './add/add.component';

import { TabsModule } from 'ng2-bootstrap/tabs';
import { DetailComponent } from './detail/detail.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { UiSwitchModule } from 'angular2-ui-switch'
import { VSChecklistModule } from 'ng2-vs-checklist';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { CustomFormsModule } from 'ng2-validation';

// import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { ModalModule } from 'ng2-bootstrap/modal';

// Ng2-select
import { SelectModule } from 'ng2-select';

//Provider
import { InnowayServiceService } from '../services/innoway-service.service'


import { UploadImageByUrlComponent } from '../modal/upload-image-by-url/upload-image-by-url.component';

import { ModalModule as Ng2ModalModule } from 'angular2-modal';
import { ModalModule as CustomModal} from '../modal/modal.module';

import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

import { PipesModule } from '../pipes/pipes.module'
import { SwiperModule } from 'angular2-useful-swiper';

@NgModule({})
export declare class Ng2UiSwitchModule extends UiSwitchModule {}

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
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
    SwiperModule
    // UploadImageByUrlComponent
  ],
  declarations: [ProductsComponent, AddComponent, DetailComponent],  //UploadImageByUrlComponent
  providers: [InnowayServiceService]
})
export class ProductsModule { }
