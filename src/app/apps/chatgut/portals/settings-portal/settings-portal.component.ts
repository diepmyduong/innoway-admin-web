import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import * as Portals from '../'
import { ChatbotApiService, iPage, iSetting, iStory } from 'app/services/chatbot'
import * as _ from 'lodash'
declare var swal: any
@Component({
  selector: 'app-settings-portal',
  templateUrl: './settings-portal.component.html',
  styleUrls: ['./settings-portal.component.scss']
})
export class SettingsPortalComponent extends BasePortal implements OnInit {

  constructor(
    @Host() container: Portals.PortalContainerComponent,
    private zone: NgZone,
    public chatbotApi: ChatbotApiService
  ) {
    super(container)
  }
  page: iPage

  getStartedStory: any = {
    _id: "1",
    name: "Story 1",
  }

  async ngOnInit() {
    this.showLoading()
    const { app } = this.chatbotApi.chatbotAuth
    this.page = await this.chatbotApi.page.getItem(app.activePage as string, {
      local: true, reload: true, query: {
        populates: ["settings"]
      }
    })
    this.hideLoading()
    console.log('page', this.page)
  }

  async reloadPage(pageId: string) {
    this.page = await this.chatbotApi.page.getItem(pageId, {
      local: false, reload: true, query: {
        populates: ["settings"]
      }
    })
  }

  async openMenu() {
    let setting: iSetting = _.find(this.page.settings, (setting: iSetting) => {
      return setting.type === "persistent_menu"
    })
    if (setting === undefined) {
      this.showLoading()
      setting = await this.chatbotApi.page.addSetting({
        type: "persistent_menu",
        option: [{
          locale: "default",
          composer_input_disabled: false,
          call_to_actions: [{
            "type": "web_url",
            "title": "Web URL",
            "url": "http://google.com"
          }]
        }]
      })
      await this.reloadPage(this.chatbotApi.chatbotAuth.app.activePage as string)
      this.hideLoading()
    }
    console.log('setting', setting)
    this.container.pushPortalAt(this.index + 1, Portals.MenuPortalComponent, { settingId: setting._id })
  }

  async openGreeting() {
    let setting: iSetting = _.find(this.page.settings, (setting: iSetting) => {
      return setting.type === "greeting"
    })
    if (setting === undefined) {
      this.showLoading()
      setting = await this.chatbotApi.page.addSetting({
        type: "greeting",
        option: [{
          locale: "default",
          text: "Xin chào {{user_first_name}} {{user_last_name}}!"
        }]
      })
      await this.reloadPage(this.chatbotApi.chatbotAuth.app.activePage as string)
      this.hideLoading()
    }
    console.log('setting', setting)
    this.container.pushPortalAt(this.index + 1, Portals.GreetingPortalComponent, { settingId: setting._id })
  }

  async openGetStarted() {
    console.log("page",this.page)
    let setting: iSetting = _.find(this.page.settings, (setting: iSetting) => {
      return setting.type === "get_started"
    })
    if (setting === undefined) {
      const storyId = await this.getStoryDialog()
      this.showLoading()
      setting = await this.chatbotApi.page.addSetting({
        type: "get_started",
        option: {
          payload: JSON.stringify({
            type: "story",
            data: storyId
          })
        }
      })
      console.log('create new setting', setting)
      await this.reloadPage(this.chatbotApi.chatbotAuth.app.activePage as string)
      this.hideLoading()
    }
    console.log('setting', setting)
    let payload = JSON.parse(setting.option.payload)
    const storyId = await this.getStory(payload.data)
    console.log('storyId', storyId)
    if (storyId && storyId != payload.data) {
      setting.option.payload = JSON.stringify({
        type: "story",
        data: storyId
      })
      await this.chatbotApi.setting.update(setting._id, setting)
      // await this.chatbotApi.page.activeSetting(setting._id)
      await this.reloadPage(this.chatbotApi.chatbotAuth.app.activePage as string)
    }
  }

  getStory(storyId?: string) {
    return new Promise((resolve, reject) => {
      const componentRef = this.container.pushPortalAt(this.index + 1, Portals.StoriesPortalComponent, {
        mode: "select", selectedStory: storyId
      })
      const component = componentRef.instance as Portals.StoriesPortalComponent
      this.subscriptions.onStorySelected = component.onStorySelected.subscribe(storyId => {
        resolve(storyId)
        component.onStorySelected.unsubscribe()
      })
    })

  }

  async getStoryDialog() {
    let stories = this.chatbotApi.story.items.getValue()
    if (stories.length === 0) {
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

  async openWhitelist() {
    this.container.pushPortalAt(this.index + 1, Portals.WhiteListPortalComponent)
  }

  async editGetStartedStory() {
    this.getStartedStory = await this.getStory(this.getStartedStory)
  }

}
