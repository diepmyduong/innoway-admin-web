import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import * as Portals from '../'
@Component({
  selector: 'app-settings-portal',
  templateUrl: './settings-portal.component.html',
  styleUrls: ['./settings-portal.component.scss']
})
export class SettingsPortalComponent extends BasePortal implements OnInit {

  constructor(
    @Host() container: Portals.PortalContainerComponent,
    private zone: NgZone
  ) { 
    super(container)
  }

  getStartedStory:any = {
    _id: "1",
    name: "Story 1",
  }

  ngOnInit() {
  }

  async openMenu() {
    this.container.pushPortalAt(this.index + 1,Portals.MenuPortalComponent)
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
