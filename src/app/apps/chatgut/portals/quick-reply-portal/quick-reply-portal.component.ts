import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import { PortalContainerComponent } from '../portal-container/portal-container.component'
import { ChatbotApiService, iCard } from 'app/services/chatbot'
import * as Cards from '../../cards'
@Component({
  selector: 'app-quick-reply-portal',
  templateUrl: './quick-reply-portal.component.html',
  styleUrls: ['./quick-reply-portal.component.scss']
})
export class QuickReplyPortalComponent extends BasePortal implements OnInit {

  @Input() cardId: string
  @ViewChild("cardContainer", { read: Cards.CardContainerComponent }) cardContainer: Cards.CardContainerComponent
  constructor(
    @Host() container: PortalContainerComponent,
    private zone: NgZone,
    public chatbotApi: ChatbotApiService
  ) {
    super(container)
  }
  card: iCard

  async ngOnInit() {
    this.card = await this.chatbotApi.card.getItem(this.cardId, { local: true, reload: true })
    console.log('add quick reply card', this.card)
    if (!this.card.option.quick_replies) this.card.option.quick_replies = [{
      type: "quick_reply_text",
      content_type: "text",
      title: "Sample Reply",
      payload: JSON.stringify({
        type: "story",
        data: this.card.story
      })
    }]
    this.cardContainer.pushCardComp(Cards.QuickReplyCardComponent, { card: this.card }, false)
  }



}
