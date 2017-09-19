import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup} from '@angular/forms';
import { PageService } from '../../services/page.service';

import { GenericElementFormGroup,GenericElementValidateMessages} from '../../forms/genericElement.groups';
export class ElementModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'app-modal-element',
  templateUrl: './modal-element.component.html',
  styleUrls: ['./modal-element.component.scss']
})
export class ModalElementComponent implements OnInit,CloseGuard, ModalComponent<ElementModalContext> {

  context: ElementModalContext;
  frmElement: FormGroup;
  page:any;

  constructor(
    public dialog: DialogRef<ElementModalContext>,
    private fb: FormBuilder,
    private pageService:PageService,
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    console.log("QUICK REPLY MODAL",this.context);
    this.frmElement = GenericElementFormGroup(this.fb);
    this.frmElement.controls['title'].setValue(this.context.data.title);
    this.frmElement.controls['subtitle'].setValue(this.context.data.subtitle);
    this.frmElement.controls['image_url'].setValue(this.context.data.image_url);
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
    if(this.frmElement.valid){
      var data:any = {
        title: this.frmElement.controls["title"].value
      };
      if(this.frmElement.controls["subtitle"]){
        data.subtitle = this.frmElement.controls["subtitle"].value;
      }
      if(this.frmElement.controls["image_url"]){
        data.image_url = this.frmElement.controls["image_url"].value;
      }
      this.dialog.close(data);
    }
  }

}
