import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

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

  constructor(
    public dialog: DialogRef<TextCardModalContext>
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
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

}
