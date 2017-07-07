import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

export class ButtonCardModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'app-modal-button-card',
  templateUrl: './modal-button-card.component.html',
  styleUrls: ['./modal-button-card.component.scss']
})
export class ModalButtonCardComponent implements OnInit,CloseGuard, ModalComponent<ButtonCardModalContext> {

  context: ButtonCardModalContext;

  constructor(
    public dialog: DialogRef<ButtonCardModalContext>
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
