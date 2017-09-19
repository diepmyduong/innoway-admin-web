import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-buttons-card',
  templateUrl: './buttons-card.component.html',
  styleUrls: ['./buttons-card.component.scss']
})
export class ButtonsCardComponent implements OnInit {

  @Input() data:any;
  @Output() onEdited = new EventEmitter<any>();
  @Output() onRemoved = new EventEmitter<any>();
  @Output() onOrderChanged = new EventEmitter<any>();
  @Output() onAddButton = new EventEmitter<any>();
  @Output() onEditButton = new EventEmitter<any>();
  @Output() onRemoveButton = new EventEmitter<any>();
  @Output() onPostback = new EventEmitter<any>();
  @Output() onQuickReplies = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {

  }

  editCard(){
    this.onEdited.emit(this.data);
  }

  removeCard(){
    this.onRemoved.emit(this.data);
  }

  upOrder(){
    this.onOrderChanged.emit("up");
  }

  downOrder(){
    this.onOrderChanged.emit("down");
  }

  addButton(){
    this.onAddButton.emit();
  }

  editButton(index){
    this.onEditButton.emit(index);
  }

  removeButton(index){
    this.onRemoveButton.emit(index);
  }

  showStory(index){
    this.onPostback.emit(index);
  }

  quickReplies(){
    this.onQuickReplies.emit();
  }

}
