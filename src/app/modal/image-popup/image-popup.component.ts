import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import * as _ from 'lodash'
import * as Ajv from 'ajv'
import { FormControl } from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'image-popup',
  styleUrls: ['./image-popup.component.scss'],
  templateUrl: './image-popup.component.html',
})
export class ImagePopupDialog implements OnInit {

  imageSrc: string
  videoEmbedHTML: any

  constructor(
    public dialogRef: MatDialogRef<ImagePopupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer ) {
    if (this.data.image) {
      this.imageSrc = this.data.image
    }
    if (this.data.video) {
      console.log(this.data.video)
      this.videoEmbedHTML = this.sanitizer.bypassSecurityTrustHtml(this.data.video)
      console.log(this.videoEmbedHTML)
    }
  }

  ngOnInit() {
  }
  
  close() {
    this.dialogRef.close();
  }

}