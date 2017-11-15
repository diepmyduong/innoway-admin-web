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
  styleUrls: ['./text-card.component.scss']
})
export class TextCardComponent extends BaseCard implements OnInit {

  @Input() card: iCard
  @ViewChild('cardFrm', { read: NgForm }) cardFrm: NgForm
  @ViewChild('saveToggle', { read: MatSlideToggle}) saveToggle: MatSlideToggle
  constructor(
    @Host() container: CardContainerComponent,
    public chatbotApi: ChatbotApiService
  ) { 
    super(container)
  }
  cardState: iCard

  ngOnInit() {
    console.log('card',this.card)
    this.updateCardState()
  }

  async onSave(formCtrl: NgForm, toggleChange:MatSlideToggleChange) {
    console.log('on Save')
    if(toggleChange.checked) {
      // Disable Change
      toggleChange.source.setDisabledState(true)
      formCtrl.form.disable()
      const portalContainer = this.container.container
      const curretnPortalIndex = portalContainer.swiperWrapper.indexOf(this.container.parentViewRef)
      const currentPortal = portalContainer.portals[curretnPortalIndex]
      currentPortal.showLoading()
      // Update Card
      try {
        const card = await this.chatbotApi.card.update(this.card._id,this.card, { reload: true })
        this.resetForm(formCtrl, this.card)
        this.updateCardState()
        this.container.change.emit({
          status: "save",
          data: card
        })
      } catch (err) {
        this.alertSaveFailed()
        this.resetForm(formCtrl,this.cardState)
        console.error("Save card error",err)
      } finally {
        formCtrl.form.enable()
        currentPortal.hideLoading()
      }
      
    }
  }

  resetForm(formCtrl: NgForm,card: iCard) {
    formCtrl.reset({
      text: card.option.text
    })
  }

  alertSaveFailed(){
    return swal("Không thể lưu","Vui lòng thử lại sau","warning")
  }

  updateCardState() {
    this.cardState = Object.assign({},this.card)
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
