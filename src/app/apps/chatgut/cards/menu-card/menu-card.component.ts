import { Component, OnInit, Host, ViewChild,ViewChildren, QueryList } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import * as Buttons from '../../buttons'
import { iCard, ChatbotApiService } from 'app/services/chatbot'
@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss']
})
export class MenuCardComponent extends BaseCard implements OnInit {

  @ViewChild("swiper") swiperComp: any
  @ViewChild('menu' ) firstMenu: Buttons.ButtonContainerComponent
  @ViewChild('secondMenu' ) secondMenu: Buttons.ButtonContainerComponent
  @ViewChild('thirdMenu' ) thirdMenu: Buttons.ButtonContainerComponent
  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) {
    super(container, chatbotApi)
    this.validButtons = {
      web_url: Buttons.UrlButtonComponent,
      postback: Buttons.PostbackButtonComponent,
      phone_number: Buttons.PhoneButtonComponent,
      nested: Buttons.NestedButtonComponent,
    }
    this.lastValidButtons = {
      web_url: Buttons.UrlButtonComponent,
      postback: Buttons.PostbackButtonComponent,
      phone_number: Buttons.PhoneButtonComponent
    }
    this.swiperOptions = {
      pagination: {
        el: '.menu-pagination',
        type: 'bullets',
        clickable: true,
        dynamicBullets: true,
      },
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: '.menu-button-next',
        prevEl: '.menu-button-prev',
      },
      spaceBetween: 10
    }
  }
  validButtons: Buttons.IValidButtons // Valid Menu Item for first and second Menu
  lastValidButtons: Buttons.IValidButtons // Valid Menu Item for third Menu
  swiperOptions: any // Swiper Option
  activeMenu: number // Currend Active Menu level
  menuContainers: Buttons.ButtonContainerComponent[]
  self: this

  ngOnInit() {
    this.self = this
  }

  get swiper() { // Get Swiper Intanse
    return this.swiperComp.Swiper
  }

  openSubMenu(menuIndex: number, subMenu: any) {
    console.log('submenu',subMenu)
    this.activeMenu = menuIndex
    this.viewRef.detectChanges()
    this.activeMenu = menuIndex + 1
    setTimeout(()=>{
      switch(this.activeMenu) {
        case 2:
          this.secondMenu.setButtons(subMenu)
          break
        case 3:
          this.thirdMenu.setButtons(subMenu)
          break
      }
      this.swiper.slideTo(menuIndex)
      console.log(this.secondMenu)
    })
    
  }

  onClickMenuItem(buttonComp: any) {
    if(buttonComp instanceof Buttons.NestedButtonComponent) {
      const { menuIndex } = buttonComp.container
      this.openSubMenu(menuIndex,buttonComp.subMenu)
    }
    console.log('on menu button click', buttonComp)
  }

}
