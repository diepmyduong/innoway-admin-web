import { Component, OnInit, Host, ViewChild,ViewChildren, QueryList } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import * as Buttons from '../../buttons'
@Component({
  selector: 'app-quick-reply-card',
  templateUrl: './quick-reply-card.component.html',
  styleUrls: ['./quick-reply-card.component.scss']
})
export class QuickReplyCardComponent implements OnInit {

  constructor(
    @Host() public container: CardContainerComponent
  ) { 
    this.validButtons = {
      quick_reply_text: Buttons.TextQuickReplyButtonComponent
    }
  }
  validButtons: Buttons.IValidButtons // Valid Menu Item for third Menu
  replies: any[]

  ngOnInit() {
    this.replies = [{
      type: 'quick_reply_text',
      title: 'quick 1'
    }]
    console.log('container',this.container)
  }

  onButtonClick(buttonComp: any) {

  }

  addReply() {

  }

}
