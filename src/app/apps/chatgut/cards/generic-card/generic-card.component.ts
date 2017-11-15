import { Component, OnInit, Host, Input, ViewChild } from '@angular/core';
import { BaseCard } from '../card-container/base-card'
import { CardContainerComponent } from '../card-container/card-container.component'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
import { iCard, ChatbotApiService } from 'app/services/chatbot'
import * as Buttons from '../../buttons'
import * as Ajv from 'ajv'
declare var swal:any
@Component({
  selector: 'app-generic-card',
  templateUrl: './generic-card.component.html',
  styleUrls: ['./generic-card.component.scss']
})
export class GenericCardComponent extends BaseCard implements OnInit {

  @Input() card: iCard
  @ViewChild('cardFrm', { read: NgForm }) cardFrm: NgForm
  @ViewChild('saveToggle', { read: MatSlideToggle}) saveToggle: MatSlideToggle
  @ViewChild("swiper") swiperComp: any
  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
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
  cardState: iCard

  ngOnInit() {
    this.updateCardState()
    console.log('generic card', this.card)
  }

  addElement() {
    if(this.card.option.attachment.payload.elements.length >= 10) {
      swal("Không thể thêm hình", "Chỉ được phép thêm 10 hình", "warning")
      return
    }
    const element = {
      title: "Tiêu đề",
      subtitle: "Mô tả ngắn",
      image_url: "http://material.angular.io/assets/img/examples/shiba2.jpg",
      buttons: [{
        type: "web_url",
        title: "Nút Web URL",
        url: "https://google.com"
      }]
    }
    this.card.option.attachment.payload.elements.push(element)
    this.saveToggle.setDisabledState(false)
    this.saveToggle.checked = false    
  }

  removeElement(elementIndex:number){
    console.log('index', elementIndex)
    if(this.card.option.attachment.payload.elements.length == 1) {
      swal("Không thể xoá hình", "Yêu cầu ít nhất phải có 1 hình", "warning")
      return
    }
    this.card.option.attachment.payload.elements.splice(elementIndex, 1)
    this.saveToggle.setDisabledState(false)
    this.saveToggle.checked = false
  }

  async editImage(elementIndex){
    let element = this.card.option.attachment.payload.elements[elementIndex]
    const url = await this.getImageUrl(element.image_url)
    if(element.image_url != url) {
      element.image_url = url
      this.card.option.attachment.payload.elements[elementIndex] = element
      this.saveToggle.setDisabledState(false)
      this.saveToggle.checked = false
    }
  }

  getImageUrl(url:string = ""){
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

  updateCardState() {
    console.log('update card state')
    this.cardState = Object.assign({},this.card)
  }

  async onSave(formCtrl: NgForm, toggleChange:MatSlideToggleChange) {
    if(toggleChange.checked) {
      // Disable Change
      toggleChange.source.setDisabledState(true)
      formCtrl.form.disable()
      // Update Card
      try {
        const card = await this.chatbotApi.card.update(this.card._id,this.card, { reload: true })
        formCtrl.form.enable()
        this.resetForm(formCtrl,this.card)
        this.updateCardState()
        this.container.change.emit({
          status: "save",
          data: card
        })
      } catch (err) {
        swal("Không thể lưu","Vui lòng thử lại sau","warning")
        formCtrl.form.enable()
        this.saveToggle.setDisabledState(false)
        this.saveToggle.checked = false
      }
      
    }
  }

  resetForm(formCtrl: NgForm,card: iCard) {
    let resetData = {
      sharable: card.option.attachment.payload.sharable,
      imageAspectRatio: card.option.attachment.payload.image_aspect_ratio,
    }
    card.option.attachment.payload.elements.forEach((element,index) => {
      resetData[`title-${index}`] = element.title
      resetData[`subtitle-${index}`] = element.subtitle
    })
    formCtrl.resetForm(resetData)
  }

  onButtonsChange(elementIndex:number,buttons: any[]) {
    this.card.option.attachment.payload.elements[elementIndex].buttons = buttons
    this.saveToggle.checked = false
    this.saveToggle.setDisabledState(false)
  }

  async remove() {
    await swal({
      title: 'Xác nhận xoá thẻ',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ'
    })
    const portalContainer = this.container.container
    const curretnPortalIndex = portalContainer.swiperWrapper.indexOf(this.container.parentViewRef)
    const currentPortal = portalContainer.portals[curretnPortalIndex]
    currentPortal.showLoading()
    await this.chatbotApi.card.delete(this.card._id)
    currentPortal.hideLoading()
    this.container.popCardComp(this.index)
    this.container.change.emit({
      status: "remove",
      data: this.card
    })
  }

}
