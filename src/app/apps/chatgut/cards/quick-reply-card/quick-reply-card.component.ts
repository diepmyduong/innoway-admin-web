import { Component, OnInit, Host, Input, ViewChild } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
import { iCard, ChatbotApiService } from 'app/services/chatbot'
import * as Buttons from '../../buttons'
declare var swal: any
@Component({
  selector: 'app-quick-reply-card',
  templateUrl: './quick-reply-card.component.html',
  styleUrls: ['./quick-reply-card.component.scss']
})
export class QuickReplyCardComponent extends BaseCard implements OnInit {

  constructor(
    @Host() public container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) {
    super(container, chatbotApi)
    this.validButtons = {
      quick_reply_text: Buttons.TextQuickReplyButtonComponent,
      quick_reply_location: Buttons.LocationQuickReplyButtonComponent,
    }
  }
  validButtons: Buttons.IValidButtons // Valid Menu Item for third Menu

  onButtonsChange(buttons: any[]) {
    this.card.option.quick_replies = buttons
    this.saveToggle.checked = false
    this.saveToggle.setDisabledState(false)
  }

  async remove() {
    await swal({
      title: 'Xác nhận xoá trả lời nhanh',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ'
    })
    const currentPortal = this.container.container.portals[this.portalIndex]
    currentPortal.showLoading()
    delete this.card.option.quick_replies
    await this.chatbotApi.card.update(this.card._id, this.card)
    currentPortal.hideLoading()
    this.container.container.popPortal(this.portalIndex)
  }

}
