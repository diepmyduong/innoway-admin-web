import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild, ElementRef, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import { IValidButtons } from './base-button'
import { CardContainerComponent, MenuCardComponent } from '../../cards'
import * as Buttons from '../'
import * as _ from 'lodash'
import * as Ajv from 'ajv'
import { ChatbotApiService, iStory } from 'app/services/chatbot'
declare var swal: any
@Component({
  selector: 'app-button-container',
  templateUrl: './button-container.component.html',
  styleUrls: ['./button-container.component.scss']
})
export class ButtonContainerComponent implements OnInit {

  @ViewChild("buttonViewContainer", { read: ViewContainerRef }) buttonViewContainer: ViewContainerRef
  @ViewChild("buttonListRef", { read: ElementRef }) buttonListRef: ElementRef
  @Input() container: CardContainerComponent
  @Input() limit: number = 3
  @Input() validButtons: IValidButtons
  @Input() menuComp: MenuCardComponent
  @Input() buttons: any[]
  @Input() menuIndex: number
  @Input() readOnly: boolean = false
  @Output() onButtonClick = new EventEmitter<any>()
  @Output() change = new EventEmitter<any[]>()
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewRef: ViewContainerRef,
    public chatbotApi: ChatbotApiService
  ) {
    this.buttonComps = []
    this.buttonInited = new BehaviorSubject<number>(-1)
    this.subscriptions = []
  }
  buttonComps: any[]
  buttonInited: BehaviorSubject<number>
  buttonTypesDisplay = {
    web_url: "Mở trang web",
    postback: "Chuyển câu truyện",
    phone_number: "Gọi điện thoại",
    element_share: "Chia sẻ",
    nested: "Menu mở rộng",
    quick_reply_text: "Trả lời câu truyện khác",
    quick_reply_location: "Trả lời bản đồ địa chỉ"
  }
  subscriptions: Subscription[]

  ngOnInit() {
    this.setButtons(this.buttons)
  }

  setButtons(buttons) {
    this.buttons = buttons
    this.buttonComps = []
    if (this.buttons) {
      for (let button of this.buttons) {
        const { type, ...params } = button
        if (this.readOnly) button.readOnly = true
        if (this.validButtons[type]) {
          this.pushButtonComp(this.validButtons[type], {
            button, readOnly: this.readOnly
          }, false)
        }
      }
    }
  }

  pushButtonComp(buttonComp: any, params: any = {}, scroll: boolean = true) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(buttonComp);
    let componentRef = componentFactory.create(this.buttonViewContainer.parentInjector)
    let newIndex = this.buttonComps.length
    let viewRef = this.buttonViewContainer.insert(componentRef.hostView, newIndex)
    let component: any = componentRef.instance
    component.viewRef = viewRef
    component.viewInited = this.buttonInited
    _.merge(component, params)
    this.buttonComps.push(component)
    if (scroll) this.scrollToBottom()
    return componentRef
  }

  scrollToBottom(): void {
    try {
      $(this.buttonListRef.nativeElement)
        .closest('.portal-content-block')
        .animate({
          scrollTop: this.container.cardListRef.nativeElement.scrollHeight
        }, 1000)
    } catch (err) { }
  }

  popButtonComp(index: number) {
    this.buttonViewContainer.remove(index)
    this.buttonComps.splice(index, 1)
    this.buttons.splice(index, 1)
    this.change.emit(this.buttons)
  }

  async addButton() {
    const type = await this.getButtonTypeDialog()
    if (this.validButtons[type]) {
      switch (type) {
        case "web_url":
          this.addUrlButton()
          break
        case "postback":
          this.addPostbackButton()
          break
        case "phone_number":
          this.addPhoneButton()
          break
        case "nested":
          this.addNestedButton()
          break
        case "quick_reply_text":
          this.addTextQuickReplyButton()
          break
        case "quick_reply_location":
          this.addLocaionQuickReplyButton()
          break
      }
    }
  }

  getButtonTypeDialog() {

    return swal({
      title: 'Chọn kiểu',
      input: 'radio',
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      inputOptions: _.mapValues(this.validButtons, (o, key) => {
        return this.buttonTypesDisplay[key]
      }),
      inputValidator: (result) => {
        return new Promise((resolve, reject) => {
          if (result) {
            resolve()
          } else {
            reject('Phải chọn một trong các kiểu!')
          }
        })
      }
    }, )
  }

  async addUrlButton() {
    const title = await this.getTitleDialog()
    const url = await this.getUrlDialog()
    const button = {
      type: "web_url",
      title,
      url
    }
    this.pushButtonComp(this.validButtons.web_url, { button })
    this.buttons.push(button)
    this.change.emit(this.buttons)
  }

  getUrlDialog(url: string = "") {
    return swal({
      title: 'Đường dẫn URL',
      input: 'text',
      inputValue: url,
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      inputValidator: (result) => {
        return new Promise((resolve, reject) => {
          if (result) {
            const ajv = new Ajv()
            let valid = ajv.validate({ type: "string", format: 'url' }, result);
            if (!valid) {
              reject("Yêu cầu nhập đúng định dạng URL");
              return;
            }
            resolve()
          } else {
            reject('Phải nhập đường dẫn')
          }
        })
      }
    })
  }

  getTitleDialog(title: string = "") {
    return swal({
      title: 'Tiêu đề',
      input: 'text',
      inputValue: title,
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      inputValidator: (result) => {
        return new Promise((resolve, reject) => {
          if (result) {
            resolve()
          } else {
            reject('Phải nhập tiêu đề')
          }
        })
      }
    })
  }

  async addPostbackButton() {
    const title = await this.getTitleDialog()
    const storyId = await this.getStoryDialog()
    const button = {
      type: "postback",
      title,
      payload: JSON.stringify({
        type: "story",
        data: storyId
      })
    }
    this.pushButtonComp(this.validButtons.postback, { button })
    this.buttons.push(button)
    this.change.emit(this.buttons)
  }

  async getStoryDialog() {
    let stories = this.chatbotApi.story.items.getValue()
    if(stories.length === 0) {
      stories = await this.chatbotApi.story.getList({
        reload: true, query: { limit: 0 }
      })
    }
    return await swal({
      title: 'Chọn Câu truyện',
      input: 'select',
      inputOptions: _.fromPairs(_.map(stories, (story: iStory) => [story._id, story.name])),
      inputPlaceholder: 'Chưa câu truyện nào được chọn',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          resolve()
        })
      }
    })
  }

  async addPhoneButton() {
    const title = await this.getTitleDialog()
    const phoneNumber = await this.getPhoneNumberDialog()
    const button = {
      type: "phone_number",
      title,
      payload: phoneNumber
    }
    this.pushButtonComp(this.validButtons.phone_number, { button })
    this.buttons.push(button)
    this.change.emit(this.buttons)
  }

  getPhoneNumberDialog(phoneNumber: string = "") {
    return swal({
      title: 'Số điện thoại',
      input: 'text',
      inputValue: phoneNumber,
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      inputValidator: (result) => {
        return new Promise((resolve, reject) => {
          if (result) {
            const ajv = new Ajv()
            let valid = ajv.validate({ type: "string", minLength: 10, maxLength: 11, pattern: "^0|[1-9]\d*$" }, result);
            if (!valid) {
              reject("Yêu cầu nhập đúng định dạng điện thoại");
              return;
            }
            resolve()
          } else {
            reject('Phải nhập số điện thoại')
          }
        })
      }
    })
  }

  async addNestedButton() {
    const title = await this.getTitleDialog()
    const button = {
      type: "nested",
      title,
      call_to_actions: [{
        "type": "web_url",
        "title": "Web URL",
        "url": "http://google.com"
      }]
    }
    this.pushButtonComp(this.validButtons.nested, { button })
    this.buttons.push(button)
    this.change.emit(this.buttons)
  }

  async addTextQuickReplyButton() {
    const title = await this.getTitleDialog()
    const storyId = await this.getStoryDialog()
    const button = {
      type: "quick_reply_text",
      content_type: "text",
      title,
      payload: JSON.stringify({
        type: "story",
        data: storyId
      })
    }
    this.pushButtonComp(this.validButtons.quick_reply_text, { button })
    this.buttons.push(button)
    this.change.emit(this.buttons)

  }

  async addLocaionQuickReplyButton() {
    const button = {
      type: "quick_reply_location",
      content_type: "location"
    }
    this.pushButtonComp(this.validButtons.quick_reply_location, { button })
    this.buttons.push(button)
    this.change.emit(this.buttons)

  }

  getImageUrlDialog(url: string = "") {
    return swal({
      title: 'Đường dẫn URL Hình ảnh',
      input: 'text',
      inputValue: url,
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      inputValidator: (result) => {
        return new Promise((resolve, reject) => {
          if (result) {
            const ajv = new Ajv()
            let valid = ajv.validate({ type: "string", format: 'url' }, result);
            if (!valid) {
              reject("Yêu cầu nhập đúng định dạng URL");
              return;
            }
            let tester = new Image()
            tester.src = result
            tester.onload = () => { resolve() }
            tester.onerror = () => { reject("Chỉ nhập đường dẫn hình ảnh") }
          } else {
            reject('Phải nhập đường dẫn')
          }
        })
      }
    })
  }

  onButtonChange(indexChange: number) {
    const compChange = this.buttonComps[indexChange]
    this.buttons[indexChange] = compChange.button
    this.change.emit(this.buttons)
  }
}
