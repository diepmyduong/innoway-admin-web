import { Component, OnInit, Host, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import * as Buttons from '../../buttons'
import { iCard, ChatbotApiService, iSetting } from 'app/services/chatbot'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
declare var swal: any
@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss']
})
export class MenuCardComponent extends BaseCard implements OnInit {

  @Input() setting: iSetting
  @ViewChild("swiper") swiperComp: any
  @ViewChild('menu') firstMenu: Buttons.ButtonContainerComponent
  @ViewChild('secondMenu') secondMenu: Buttons.ButtonContainerComponent
  @ViewChild('thirdMenu') thirdMenu: Buttons.ButtonContainerComponent
  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) {
    super(container, chatbotApi)
    this.validButtons = {
      web_url: Buttons.UrlButtonComponent,
      postback: Buttons.PostbackButtonComponent,
      nested: Buttons.NestedButtonComponent,
    }
    this.lastValidButtons = {
      web_url: Buttons.UrlButtonComponent,
      postback: Buttons.PostbackButtonComponent,
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
  activeButton: any = {}
  menuContainers: Buttons.ButtonContainerComponent[]
  self: this
  settingState: iSetting

  ngOnInit() {
    this.self = this
    this.updateSettingState()
  }

  updateSettingState() {
    this.settingState = Object.assign({}, this.setting)
  }

  get swiper() { // Get Swiper Intanse
    return this.swiperComp.Swiper
  }

  openSubMenu(menuIndex: number, subMenu: any) {
    console.log('submenu', subMenu)
    this.activeMenu = menuIndex
    this.viewRef.detectChanges()
    this.activeMenu = menuIndex + 1
    setTimeout(() => {
      switch (this.activeMenu) {
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
    if (buttonComp instanceof Buttons.NestedButtonComponent) {
      const { menuIndex } = buttonComp.container
      this.activeButton[menuIndex] = buttonComp.index
      this.openSubMenu(menuIndex, buttonComp.button.call_to_actions)
    }
    console.log('on menu button click', buttonComp)
  }

  onButtonsChange(menuIndex: number, buttons: any[]) {
    if (menuIndex === 1) {
      this.setting.option[0].call_to_actions = buttons
    } else if (menuIndex === 2) {
      const firstMenuButtonIndex = this.activeButton[1]
      this.setting.option[0]
        .call_to_actions[firstMenuButtonIndex]
        .call_to_actions = buttons
    } else if (menuIndex === 3) {
      const firstMenuButtonIndex = this.activeButton[1]
      const secondMenuButtonIndex = this.activeButton[2]
      this.setting.option[0]
        .call_to_actions[firstMenuButtonIndex]
        .call_to_actions[secondMenuButtonIndex]
        .call_to_actions = buttons
    }
    this.saveToggle.checked = false
    this.saveToggle.setDisabledState(false)
  }

  async onSave(formCtrl: NgForm, toggleChange: MatSlideToggleChange) {
    if (toggleChange.checked) {
      // Disable Change
      toggleChange.source.setDisabledState(true)
      formCtrl.form.disable()
      // Update Card
      try {
        const setting = await this.chatbotApi.setting.update(this.setting._id, this.setting, { reload: true })
        // await this.chatbotApi.page.activeSetting(setting._id)
        formCtrl.form.enable()
        this.resetForm(formCtrl, this.setting)
        this.updateSettingState()
        this.container.change.emit({
          status: "save",
          data: this.setting
        })
      } catch (err) {
        swal("Không thể lưu", "Vui lòng thử lại sau", "warning")
        formCtrl.form.enable()
        this.resetForm(formCtrl, this.settingState)
      }

    }
  }

}
