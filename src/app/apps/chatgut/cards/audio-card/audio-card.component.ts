import { Component, OnInit, Host, Input, ViewChild } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
import { iCard, ChatbotApiService } from 'app/services/chatbot'
declare var swal:any
@Component({
  selector: 'app-audio-card',
  templateUrl: './audio-card.component.html',
  styleUrls: ['./audio-card.component.scss']
})
export class AudioCardComponent extends BaseCard implements OnInit {
  
  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) { 
    super(container, chatbotApi)
  }

  resetForm(formCtrl: NgForm,card: iCard) {
    formCtrl.resetForm({
      url: card.option.attachment.payload.url
    })
  }

}
