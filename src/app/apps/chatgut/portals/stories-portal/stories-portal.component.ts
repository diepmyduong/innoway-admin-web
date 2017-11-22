import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import { PortalContainerComponent } from '../portal-container/portal-container.component'
import { StoryDetailPortalComponent } from '../story-detail-portal/story-detail-portal.component'
import { MatListOption, MatSelectionList, MatSlideToggle, MatSlideToggleChange } from '@angular/material'
import { ChatbotApiService, iStory, iIntent } from 'app/services/chatbot'
import * as _ from 'lodash'
declare var swal: any
@Component({
  selector: 'app-stories-portal',
  templateUrl: './stories-portal.component.html',
  styleUrls: ['./stories-portal.component.scss']
})
export class StoriesPortalComponent extends BasePortal implements OnInit {

  @Input() mode: string = "list"
  @Input() selectedStory: string
  @Input() requireSelect: boolean = true
  @Output() onStorySelected = new EventEmitter<any>()
  @ViewChild("storySelection", { read: MatSelectionList }) storySelection: MatSelectionList
  @ViewChild('saveSelectToggle', { read: MatSlideToggle}) saveToggle: MatSlideToggle
  constructor(
    @Host() container: PortalContainerComponent,
    private zone: NgZone,
    public chatbotApi: ChatbotApiService
  ) {
    super(container)
  }
  stories: iStory[]

  async ngOnInit() {
    this.showLoading()
    this.stories = _.merge([],this.chatbotApi.story.items.getValue()) // Get list from local
    if (this.stories.length === 0) { // If local empty, request to server
      this.stories = await this.chatbotApi.story.getList({
        local: false, reload: true, query: {
          fields: ["name", "status"]
        }
      })
    }
    if(this.mode == 'list') {
      this.subscriptions.stories = this.chatbotApi.story.items.subscribe(items => {
        this.stories = items
      })
    }
    this.hideLoading()
  }

  async ngAfterViewInit() {
    if (this.mode === "select") {
      console.log('selected story', this.selectedStory)
      if (this.selectedStory) {
        const option = this.storySelection.options.find(option => {
          return option.value._id == this.selectedStory
        })
        if (option) {
          setTimeout(() => {
            option.toggle()
            this.openStory(option.value)
          }, 0);
        }
      }
    }
  }

  async addStory() {
    let story: iStory = {}
    story.type = await this.getStoryTypeDialog()
    if(story.type === "intent") {
      story.intent = await this.getIntentDialog()
    }
    story.name = await this.getStoryNameDialog()
    try {
      story = await this.chatbotApi.page.addStory(story)
      this.openStory(story)
    } catch (err) {
      swal("Không thể tạo câu truyện",err.message,"warning")
    }
  }

  async openStory(story: iStory) {
    this.container.pushPortalAt(this.index + 1, StoryDetailPortalComponent, { storyId: story._id })
  }

  async getStoryTypeDialog() {
    return await swal({
      title: 'Chọn kiểu',
      input: 'radio',
      inputOptions: {
        intent: "Theo Intent",
        custom: "Tuỳ chọn"
      },
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

  async getStoryNameDialog() {
    return await swal({
      title: 'Tiêu đề',
      input: 'text',
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

  async getIntentDialog() {
    let intents = await this.chatbotApi.page.getIntents({ local: true })
    if(intents.length === 0) {
      intents = await this.chatbotApi.page.getIntents()
    }
    return await swal({
      title: 'Chọn Intent',
      input: 'select',
      inputOptions: _.fromPairs(_.map(intents, (i:iIntent) => [i.id, i.name])),
      inputPlaceholder: 'Chưa Intent nào được chọn',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          resolve()
        })
      }
    })
  }

  selectStory(option: MatListOption) {
    console.log('select story',option.selected)
    if (option.selected) {
      option.selectionList.deselectAll()
      console.log(option.selected)
      option.toggle()
      console.log(option.selected)
      this.selectedStory = option.value._id
      this.saveToggle.setDisabledState(false)
      this.saveToggle.checked = false
      this.openStory(option.value)
    }
  }

  async close() {
    if (this.mode === "select") {
      if (!this.selectedStory && this.requireSelect) {
        await swal("Yêu cầu phải chọn 1 câu chuyện", "", "warning")
        return;
      }
      if(!this.saveToggle.checked) {
        await swal({
          title: 'Lựa chọn chưa được lưu',
          showCancelButton: true,
          confirmButtonText: 'Lưu',
          cancelButtonText: 'Bỏ qua'
        })
        this.onStorySelected.emit(this.selectedStory)
      }
    }
    super.close()
  }

  async onSaveSelect(toggleChange:MatSlideToggleChange) {
    if(toggleChange.checked) {
      // Disable Change
      toggleChange.source.setDisabledState(true)
      this.onStorySelected.emit(this.selectedStory)
      setTimeout(()=>{ this.close() },500)
      
    }
  }

}