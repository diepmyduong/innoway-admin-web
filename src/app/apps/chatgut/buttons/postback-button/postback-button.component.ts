import { Component, OnInit, Host, Input } from '@angular/core';
import { BaseButton } from '../button-container/base-button'
import { ButtonContainerComponent } from '../button-container/button-container.component'
import { StoriesPortalComponent } from '../../portals'
@Component({
  selector: 'app-postback-button',
  templateUrl: './postback-button.component.html',
  styleUrls: ['./postback-button.component.scss']
})
export class PostbackButtonComponent extends BaseButton implements OnInit {

  constructor(
    @Host() container: ButtonContainerComponent
  ) {
    super(container)
  }
  payload: {
    type: string,
    data: any
  }

  async ngOnInit() {
    // if(!this.story) {
    //   this.story = await this.getStory()
    // }
    this.payload = JSON.parse(this.button.payload)
  }

  async editStory() {
    const storyId = await this.getStory(this.payload.data)
    if(this.button.payload != storyId) {
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
    super.defaultAction({ type: "postback" })
    this.editStory()
  }

}
