import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup, Validators} from '@angular/forms';
import { TextCardFormGroup, TextCardValidateMessages } from '../../chatbot/forms/text-card.groups';
import { CustomValidators } from 'ng2-validation';

export class TextCardModalContext extends BSModalContext {
  public data: any;
}


@Component({
  selector: 'upload-image-by-url',
  templateUrl: './upload-image-by-url.component.html',
  styleUrls: ['./upload-image-by-url.component.scss']
})
export class UploadImageByUrlComponent implements OnInit,CloseGuard, ModalComponent<TextCardModalContext> {

  context: TextCardModalContext;
  frmCard: FormGroup;

  constructor(
    public dialog: DialogRef<TextCardModalContext>,
    private formBuilder: FormBuilder,
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.frmCard = TextCardFormGroup(this.formBuilder);
    this.frmCard.controls["text"].setValidators([CustomValidators.url, Validators.required]);
    if(this.context.data && this.context.data.text){
      this.frmCard.controls['text'].setValue(this.context.data.text);
    }
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return false;
  }

  closeModal(){
    this.dialog.close();
  }

  add(){
    if(this.frmCard.valid){
      var data = {
        text: this.frmCard.controls['text'].value
      };
      this.dialog.close(data);
    }
  }

}
