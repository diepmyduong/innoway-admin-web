import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-card',
  templateUrl: './text-card.component.html',
  styleUrls: ['./text-card.component.scss']
})
export class TextCardComponent implements OnInit {

  @Input() data:any;
  @Output() onEdited = new EventEmitter<any>();
  @Output() onRemoved = new EventEmitter<any>();
  @Output() onOrderChanged = new EventEmitter<any>();
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

  quickReplies(){
    this.onQuickReplies.emit();
  }

}
