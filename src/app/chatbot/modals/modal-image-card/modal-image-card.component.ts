import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

export class ImageCardModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'app-modal-image-card',
  templateUrl: './modal-image-card.component.html',
  styleUrls: ['./modal-image-card.component.scss']
})
export class ModalImageCardComponent implements OnInit,CloseGuard, ModalComponent<ImageCardModalContext> {

  context: ImageCardModalContext;

  constructor(
    public dialog: DialogRef<ImageCardModalContext>
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
