import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup} from '@angular/forms';
import { TextCardFormGroup, TextCardValidateMessages } from '../../forms/text-card.groups';

export class TextCardModalContext extends BSModalContext {
  public data: any;
}


@Component({
  selector: 'app-modal-text-card',
  templateUrl: './modal-text-card.component.html',
  styleUrls: ['./modal-text-card.component.scss']
})
export class ModalTextCardComponent implements OnInit,CloseGuard, ModalComponent<TextCardModalContext> {

  context: TextCardModalContext;
  frmCard: FormGroup;

  constructor(
    public dialog: DialogRef<TextCardModalContext>,
    private fb: FormBuilder,
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.frmCard = TextCardFormGroup(this.fb);
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
