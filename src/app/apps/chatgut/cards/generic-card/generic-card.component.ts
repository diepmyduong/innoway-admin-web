import { Component, OnInit, Host, ViewChild } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import * as Buttons from '../../buttons'
@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  styleUrls: ['./generic-card.component.scss']
})
export class GenericCardComponent extends BaseCard implements OnInit {

  @ViewChild("swiper") swiperComp: any
  constructor(
    @Host() container: CardContainerComponent
  ) {
    super(container)
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
  swiperOptions:any
  validButtons: Buttons.IValidButtons

  ngOnInit() {
    
  }

  addElement() {
    
  }

  removeElement(){

  }

  editImage(){
  }

  getImageUrl(){

  }

}
