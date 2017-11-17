import { Component, OnInit, Host, Input } from '@angular/core';
import { BaseButton } from '../button-container/base-button'
import { ButtonContainerComponent } from '../button-container/button-container.component'
import { StoriesPortalComponent } from '../../portals'
@Component({
  selector: 'app-text-quick-reply-button',
  templateUrl: './text-quick-reply-button.component.html',
  styleUrls: ['./text-quick-reply-button.component.scss']
})
export class TextQuickReplyButtonComponent extends BaseButton implements OnInit {

  constructor(
    @Host() container: ButtonContainerComponent
  ) { 
    super(container)
  }
  payload: {
    type: string,
    data: any
  }

  ngOnInit() {
    this.payload = JSON.parse(this.button.payload)
  }

  async editIcon(){
    const url = await this.container.getImageUrlDialog(this.button.image_url)
    if(this.button.image_url != url) {
      this.button.image_url = url
      this.container.onButtonChange(this.index)
    }
  }

  async editStory() {
    const storyId = await this.getStory(this.payload.data)
    if(this.button.payload != storyId) {
      this.payload.data = storyId
      this.button.payload = JSON.stringify(this.payload)
      this.container.onButtonChange(this.index)
    }
  }

  getStory(storyId?: string) {
    return new Promise((resolve, reject) => {
      const cardContainer = this.container.container
      const portalContainer = cardContainer.container
      const curretnPortalIndex = portalContainer.swiperWrapper.indexOf(cardContainer.parentViewRef)
      const componentRef = this.container.container.container.pushPortalAt(curretnPortalIndex + 1, StoriesPortalComponent, {
        mode: "select", selectedStory: storyId
      })
      const component = componentRef.instance as StoriesPortalComponent
      this.subscriptions.onStorySelected = component.onStorySelected.subscribe(storyId => {
        resolve(storyId)
        component.onStorySelected.unsubscribe()
      })
    })

  }

  async defaultAction() {
    super.defaultAction(this.button)
    this.editStory()
  }

}
