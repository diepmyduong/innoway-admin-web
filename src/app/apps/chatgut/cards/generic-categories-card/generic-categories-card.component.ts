import { Component, OnInit, Host, ViewChild, Input } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import * as Buttons from '../../buttons'
import { iCard, ChatbotApiService } from 'app/services/chatbot'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle} from '@angular/material'
declare var swal:any
@Component({
  selector: 'app-generic-categories-card',
  templateUrl: './generic-categories-card.component.html',
  styleUrls: ['./generic-categories-card.component.scss']
})
export class GenericCategoriesCardComponent extends BaseCard implements OnInit {

  @ViewChild("swiper") swiperComp: any
  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) {
    super(container, chatbotApi)
    this.swiperOptions = {
      pagination: {
        el: '.element-pagination',
        type: 'bullets',
        clickable: true,
        dynamicBullets: true,
      },
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: '.element-button-next',
        prevEl: '.element-button-prev',
      },
      spaceBetween: 10
    }
    this.validButtons = {
      web_url: Buttons.UrlButtonComponent,
      postback: Buttons.PostbackButtonComponent,
      phone_number: Buttons.PhoneButtonComponent,
    }
  }
  swiperOptions: any
  validButtons: Buttons.IValidButtons
  preview:boolean = false
  previewPayload: any


  ngOnInit() {
    super.ngOnInit()
    if(!this.card.option.query) this.card.option.query = {}
    if(!this.card.option.query.filter) this.card.option.query.filter = {}
  }
  

  addElement() {

  }

  removeElement() {

  }

  editImage() {
  }

  getImageUrl() {

  }

  resetForm(formCtrl: NgForm,card: iCard) {
    formCtrl.reset({
      limit: card.option.query.limit,
      page: card.option.query.page,
      filter: card.option.query.filter.name
    })
  }

  async onPreviewToggle(toggleChange:MatSlideToggleChange) {
    this.preview = toggleChange.checked
    if(this.preview) {
      this.previewPayload = await this.chatbotApi.card.build(this.card._id)
    }else {
      this.previewPayload = undefined
    }
  }

}
