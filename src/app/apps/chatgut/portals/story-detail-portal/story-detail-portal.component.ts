import { Component, OnInit, Input, Host, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import { PortalContainerComponent } from '../portal-container/portal-container.component'
import { MatInput } from '@angular/material'
import { ChatbotApiService, iStory, iCard } from 'app/services/chatbot'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material'
import * as Cards from '../../cards'
import * as _ from 'lodash'
import * as Ajv from 'ajv'
declare var swal: any
@Component({
  selector: 'app-story-detail-portal',
  templateUrl: './story-detail-portal.component.html',
  styleUrls: ['./story-detail-portal.component.scss']
})
export class StoryDetailPortalComponent extends BasePortal implements OnInit {

  @Input() storyId: string;
  @Input() mode: "story" | "get_started" = "story"
  @ViewChild("storyNameInput", { read: MatInput }) storyNameInput: MatInput
  @ViewChild("cardContainer", { read: Cards.CardContainerComponent }) cardContainer: Cards.CardContainerComponent
  @ViewChild('saveToggle', { read: MatSlideToggle }) saveToggle: MatSlideToggle
  constructor(
    @Host() container: PortalContainerComponent,
    public chatbotApi: ChatbotApiService
  ) {
    super(container)
  }
  storyState: iStory
  cardStateChange = false
  story: iStory = {}

  async ngOnInit() {

  }

  updateStoryState() {
    this.storyState = Object.assign({}, this.story)
  }

  async ngAfterViewInit() {
    this.showLoading()
    let story = await this.chatbotApi.story.getItem(this.storyId, { local: true })
    if (!story.cards || story.cards.length === 0) { // Need to load full story object
      story = await this.reloadStory()
    }
    this.story = Object.assign({}, story)
    this.updateStoryState()
    console.log('load cards', this.story.cards)
    for (let card of this.story.cards as string[]) {
      const cardObject = await this.chatbotApi.card.getItem(card, { local: true, reload: true })
      this.loadCardToView(cardObject)
    }
    this.hideLoading()
  }

  async reloadStory() {
    return await this.chatbotApi.story.getItem(this.storyId, {
      local: false, reload: true
    })
  }

  async editStoryName(name: string) {
    try {
      await swal({
        title: 'Có lưu thay đổi',
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Huỷ'
      })
      this.storyNameInput.disabled = true
      this.story.name = name
      try {
        await this.chatbotApi.story.update(this.story._id, this.story, { reload: true })
        this.updateStoryState()
      } catch (err) {
        swal("Không thể cập nhật", "Vui lòng thử lại sau", "warning")
        this.story.name = this.storyState.name
        throw err
      } finally {
        this.storyNameInput.disabled = false
      }
    } catch (err) {
      this.storyNameInput.value = this.story.name
    }
  }

  loadCardToView(card: iCard) {

    switch (card.type) {
      case "action":
        break
      case 'text':
        this.cardContainer.pushCardComp(Cards.TextCardComponent, { card }, false)
        break
      case 'image':
        this.cardContainer.pushCardComp(Cards.ImageCardComponent, { card }, false)
        break
      case 'audio':
        this.cardContainer.pushCardComp(Cards.AudioCardComponent, { card }, false)
        break
      case "video":
        this.cardContainer.pushCardComp(Cards.VideoCardComponent, { card }, false)
        break
      case "file":
        break
      case "generic":
        this.cardContainer.pushCardComp(Cards.GenericCardComponent, { card }, false)
        break
      case "button":
        this.cardContainer.pushCardComp(Cards.ButtonsCardComponent, { card }, false)
        break
      case "list":
        break
      case "receipt":
        break
      case "generic_categories":
        this.cardContainer.pushCardComp(Cards.GenericCategoriesCardComponent, { card }, false)
        break
      case "generic_products":
        break
      case "generic_promotions":
        break
      case "generic_promotion":
        break
      case "innoway_receip":
        break
    }
  }

  async addTextCard() {
    const text = await this.getMessageDialog()
    this.showLoading()
    const card = await this.chatbotApi.story.addCard(this.storyId, {
      type: 'text',
      option: {
        text
      }
    })
    let cards = this.story.cards as string[]
    cards.push(card._id)
    this.cardContainer.pushCardComp(Cards.TextCardComponent, { card })
    this.hideLoading()
  }

  async addImageCard() {
    const url = await this.getURLDialog()
    this.showLoading()
    const card = await this.chatbotApi.story.addCard(this.storyId, {
      type: 'image',
      option: {
        attachment: {
          type: 'image',
          payload: {
            url
          }
        }
      }
    })
    let cards = this.story.cards as string[]
    cards.push(card._id)
    this.cardContainer.pushCardComp(Cards.ImageCardComponent, { card })
    this.hideLoading()
  }

  async addVideoCard() {
    const url = await this.getURLDialog()
    this.showLoading()
    const card = await this.chatbotApi.story.addCard(this.storyId, {
      type: 'video',
      option: {
        attachment: {
          type: 'video',
          payload: {
            url
          }
        }
      }
    })
    let cards = this.story.cards as string[]
    cards.push(card._id)
    this.cardContainer.pushCardComp(Cards.VideoCardComponent, { card })
    this.hideLoading()
  }

  async addAudioCard() {
    const url = await this.getURLDialog()
    this.showLoading()
    const card = await this.chatbotApi.story.addCard(this.storyId, {
      type: 'audio',
      option: {
        attachment: {
          type: 'audio',
          payload: {
            url
          }
        }
      }
    })
    let cards = this.story.cards as string[]
    cards.push(card._id)
    this.cardContainer.pushCardComp(Cards.AudioCardComponent, { card })
    this.hideLoading()
  }

  async addButtonsCard() {
    const text = await this.getMessageDialog()
    this.showLoading()
    const card = await this.chatbotApi.story.addCard(this.storyId, {
      type: "button",
      option: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text,
            buttons: [{
              type: "web_url",
              title: "Google Search",
              url: "https://google.com"
            }]
          }
        }
      }
    })
    let cards = this.story.cards as string[]
    cards.push(card._id)
    this.cardContainer.pushCardComp(Cards.ButtonsCardComponent, { card })
    this.hideLoading()
  }

  async addGenericCard() {
    this.showLoading()
    const card = await this.chatbotApi.story.addCard(this.storyId, {
      type: "generic",
      option: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [{
              title: "Tiêu đề",
              subtitle: "Mô tả ngắn",
              image_url: "http://material.angular.io/assets/img/examples/shiba2.jpg",
              buttons: [{
                type: "web_url",
                title: "Nút Web URL",
                url: "https://google.com"
              }]
            }]
          }
        }
      }
    })
    let cards = this.story.cards as string[]
    cards.push(card._id)
    this.cardContainer.pushCardComp(Cards.GenericCardComponent, { card })
    this.hideLoading()
  }

  addQuickReplyCard() {
    this.showLoading()
    this.cardContainer.pushCardComp(Cards.QuickReplyCardComponent)
    this.hideLoading()
  }

  async onCardChange(change: Cards.iOnCardsChange) {
    if (change.status === "remove") {
      this.showLoading()
      let story = await this.reloadStory()
      this.story = Object.assign({}, story)
      this.hideLoading()
    }
    if (change.status === "order") {
      const { from, to } = change.data
      let cards = this.story.cards as any[]
      const fromIndex = cards.indexOf(from._id)
      const toIndex = cards.indexOf(to._id)
      if(fromIndex < toIndex) {
        cards.splice(toIndex + 1, 0, cards[fromIndex])
        cards.splice(fromIndex, 1)
      } else {
        cards.splice(toIndex, 0, cards[fromIndex])
        cards.splice(fromIndex + 1, 1)
      }
      this.story.cards = cards
      this.saveToggle.setDisabledState(false)
      this.saveToggle.checked = false
    }
  }

  async onSave(formCtrl: NgForm, toggleChange: MatSlideToggleChange) {
    if (toggleChange.checked) {
      // Disable Change
      toggleChange.source.setDisabledState(true)

      // Update Card
      try {
        // await swal({
        //   title: 'Có lưu thay đổi',
        //   showCancelButton: true,
        //   confirmButtonText: 'Lưu',
        //   cancelButtonText: 'Huỷ'
        // })
        try {
          this.showLoading()
          formCtrl.form.disable()
          await this.chatbotApi.story.update(this.story._id, this.story, { reload: true })
          this.cardContainer.saveCards()
          formCtrl.reset({
            name: this.story.name
          })
          this.updateStoryState()
        } catch (err) {
          swal("Không thể cập nhật", "Vui lòng thử lại sau", "warning")
          formCtrl.reset({
            name: this.storyState.name
          })
          throw err
        } finally {
          this.hideLoading()
          formCtrl.form.enable()
        }
      } catch (err) {

      }

    }
  }

  getMessageDialog() {
    return swal({
      title: 'Tin nhắn',
      input: 'text',
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      inputValidator: (result) => {
        return new Promise((resolve, reject) => {
          if (result) {
            resolve()
          } else {
            reject('Phải nhập tin nhắn')
          }
        })
      }
    })
  }

  getURLDialog() {
    return swal({
      title: 'Đường dẫn URL',
      input: 'text',
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

  async removeStory() {
    await swal({
      title: 'Xoá Câu truyện',
      text: "Bạn có muốn xoá câu truyện này không",
      showCancelButton: true,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Huỷ'
    })
    await this.chatbotApi.story.delete(this.storyId, { reload: true })
    setTimeout(() => {
      this.close()
    }, 500);
  }
}
