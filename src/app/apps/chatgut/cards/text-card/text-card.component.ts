import { Component, OnInit, Host, Input, ViewChild } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import { iCard } from 'app/services/chatbot'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
import { ChatbotApiService } from 'app/services/chatbot'

declare var swal:any
@Component({
  selector: 'app-text-card',
  templateUrl: './text-card.component.html',
  styleUrls: ['./text-card.component.scss'],
})
export class TextCardComponent extends BaseCard implements OnInit {

  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) { 
    super(container, chatbotApi)
  }

  resetForm(formCtrl: NgForm,card: iCard) {
    formCtrl.reset({
      text: card.option.text
    })
  }
}
