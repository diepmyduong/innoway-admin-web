import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadImageByUrlComponent } from './upload-image-by-url/upload-image-by-url.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [UploadImageByUrlComponent],
  entryComponents: [UploadImageByUrlComponent]
})
export class ModalModule { }
