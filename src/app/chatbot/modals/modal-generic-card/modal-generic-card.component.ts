import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

export class GenericCardModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'app-modal-generic-card',
  templateUrl: './modal-generic-card.component.html',
  styleUrls: ['./modal-generic-card.component.scss']
})
export class ModalGenericCardComponent implements OnInit,CloseGuard, ModalComponent<GenericCardModalContext> {

  context: GenericCardModalContext;

  constructor(
    public dialog: DialogRef<GenericCardModalContext>
  ) { 
    
  }

  ngOnInit() {
    this.context = this.dialog.context;
    this.dialog.setCloseGuard(this);
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
      var data = {
        type: this.context.data.type
      };
      this.dialog.close(data);
  }

}
