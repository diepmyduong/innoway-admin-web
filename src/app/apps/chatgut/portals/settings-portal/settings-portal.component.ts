import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import * as Portals from '../'
import { ChatbotApiService, iPage, iSetting } from 'app/services/chatbot'
import * as _ from 'lodash'
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

  getStartedStory:any = {
    _id: "1",
    name: "Story 1",
  }

  async ngOnInit() {
    this.showLoading()
    const { app } = this.chatbotApi.chatbotAuth
    this.page = await this.chatbotApi.page.getItem(app.activePage as string, { local: true, reload: true, query: {
      populates: ["settings"]
    }})
    this.hideLoading()
    console.log('page', this.page)
  }

  async openMenu() {
    let setting:iSetting = _.find(this.page.settings, (setting:iSetting) => {
      return setting.type === "persistent_menu"
    })
    if(setting === undefined) {
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
      this.hideLoading()
    }
    console.log('setting', setting)
    this.container.pushPortalAt(this.index + 1,Portals.MenuPortalComponent, { settingId: setting._id })
  }

  async openGreeting() {
    this.container.pushPortalAt(this.index + 1,Portals.GreetingPortalComponent)
  }

  async openGetStarted() {
    if(this.getStartedStory) {
      this.container.pushPortalAt(this.index + 1,Portals.StoryDetailPortalComponent, {
        mode: "get_started",
        story: this.getStartedStory
      })
    }else {
      this.editGetStartedStory()
    }
    
  }

  async openWhitelist() {
    this.container.pushPortalAt(this.index + 1, Portals.WhiteListPortalComponent)
  }

  async editGetStartedStory() {
    this.getStartedStory = await this.getStory(this.getStartedStory)
  }

  getStory(story?:any) {
    return new Promise((resolve,reject)=>{
      const componentRef = this.container.pushPortalAt(this.index + 1,Portals.StoriesPortalComponent, {
        mode: "select", selectedStory: story
      })
      const component = componentRef.instance as Portals.StoriesPortalComponent
      this.subscriptions.onStorySelected = component.onStorySelected.subscribe(story => {
        resolve(story)
        component.onStorySelected.unsubscribe()
      })
    })
  }

}
