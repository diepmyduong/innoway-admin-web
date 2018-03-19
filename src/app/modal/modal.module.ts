import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadImageByUrlComponent } from './upload-image-by-url/upload-image-by-url.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from "@agm/core";
import { CallModalComponent } from './call-modal/call-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,

  ],
  declarations: [UploadImageByUrlComponent, CallModalComponent],
  entryComponents: [UploadImageByUrlComponent]
})
export class ModalModule { }
