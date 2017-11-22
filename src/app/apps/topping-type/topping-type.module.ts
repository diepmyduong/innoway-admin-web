import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToppingTypeRoutingModule } from './topping-type-routing.module';
import { ToppingTypeComponent } from './topping-type.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { VSChecklistModule } from 'ng2-vs-checklist';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { CustomFormsModule } from 'ng2-validation';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SelectModule } from 'ng2-select';
import { UploadImageByUrlComponent } from 'app/modal/upload-image-by-url/upload-image-by-url.component';
import { ModalModule as Ng2ModalModule } from 'angular2-modal';
import { ModalModule as CustomModal} from 'app/modal/modal.module';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from 'angular-2-data-table-bootstrap4';

// @NgModule({})
// export declare class Ng2UploadImageByUrlComponent extends UploadImageByUrlComponent {}

@NgModule({
  imports: [
    CommonModule,
    // ToppingTypeModule,
    ToppingTypeRoutingModule,
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
    DataTableModule
  ],
  declarations: [ToppingTypeComponent, AddComponent, DetailComponent],
  providers: []
})
export class ToppingTypeModule { }
