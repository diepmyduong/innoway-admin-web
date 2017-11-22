import { Component, OnInit, Host, Input, ViewChild } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
import { iCard, ChatbotApiService } from 'app/services/chatbot'
import * as Buttons from '../../buttons'
declare var swal:any
@Component({
  selector: 'app-buttons-card',
  templateUrl: './buttons-card.component.html',
  styleUrls: ['./buttons-card.component.scss']
})
export class ButtonsCardComponent extends BaseCard implements OnInit {

  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) { 
    super(container, chatbotApi)
    this.validButtons = {
      web_url: Buttons.UrlButtonComponent,
      postback: Buttons.PostbackButtonComponent,
      phone_number: Buttons.PhoneButtonComponent,
    }
  }
  validButtons: Buttons.IValidButtons

  resetForm(formCtrl: NgForm,card: iCard) {
    formCtrl.resetForm({
      text: card.option.attachment.payload.text
    })
  }

  onButtonsChange(buttons: any[]) {
    this.card.option.attachment.payload.buttons = buttons
    this.saveToggle.checked = false
    this.saveToggle.setDisabledState(false)
  }

}
