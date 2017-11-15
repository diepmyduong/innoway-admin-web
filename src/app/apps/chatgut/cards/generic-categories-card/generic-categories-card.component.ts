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

  @Input() card: iCard
  @ViewChild("swiper") swiperComp: any
  @ViewChild('cardFrm', { read: NgForm }) cardFrm: NgForm
  @ViewChild('saveToggle', { read: MatSlideToggle}) saveToggle: MatSlideToggle
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
  swiperOptions: any
  validButtons: Buttons.IValidButtons
  preview:boolean = false
  previewPayload: any
  cardState: iCard


  ngOnInit() {
    if(!this.card.option.query) this.card.option.query = {}
    if(!this.card.option.query.filter) this.card.option.query.filter = {}
    this.updateCardState()
  }
  

  addElement() {

  }

  removeElement() {

  }

  editImage() {
  }

  getImageUrl() {

  }

  updateCardState() {
    this.cardState = Object.assign({},this.card)
  }

  async onSave(formCtrl: NgForm, toggleChange:MatSlideToggleChange) {
    console.log('on Save')
    if(toggleChange.checked) {
      // Disable Change
      toggleChange.source.setDisabledState(true)
      formCtrl.form.disable()
      // Update Card
      try {
        console.log('save card', this.card)
        const card = await this.chatbotApi.card.update(this.card._id,this.card, { reload: true })
        formCtrl.form.enable()
        this.resetForm(formCtrl, card)
        this.updateCardState()
        this.container.change.emit({
          status: "save",
          data: card
        })
      } catch (err) {
        swal("Không thể lưu","Vui lòng thử lại sau","warning")
        formCtrl.form.enable()
        this.resetForm(formCtrl, this.cardState)
        console.error("Save card error",err)
      }
      
    }
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
      console.log('generic payload', this.previewPayload)
    }else {
      this.previewPayload = undefined
    }
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
