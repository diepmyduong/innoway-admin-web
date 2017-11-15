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

  @Input() story:any
  @Input() image_url:string
  constructor(
    @Host() container: ButtonContainerComponent
  ) { 
    super(container)
  }

  ngOnInit() {
  }

  async editIcon(){
    this.image_url = await this.container.getImageUrlDialog(this.image_url)
  }

  async editStory() {
    console.log('reply',this.story)
    this.story = await this.getStory(this.story)
  }

  getStory(story?:any) {
    return new Promise((resolve,reject)=>{
      const cardContainer = this.container.container
      console.log('button container',this.container)
      console.log('cardContainer',cardContainer)
      const portalContainer = cardContainer.container
      const curretnPortalIndex = portalContainer.swiperWrapper.indexOf(cardContainer.parentViewRef)
      const componentRef = this.container.container.container.pushPortalAt(curretnPortalIndex + 1,StoriesPortalComponent, {
        mode: "select", selectedStory: story
      })
      const component = componentRef.instance as StoriesPortalComponent
      this.subscriptions.onStorySelected = component.onStorySelected.subscribe(story => {
        resolve(story)
        component.onStorySelected.unsubscribe()
      })
    })
    
  }

  async defaultAction() {
    super.defaultAction({ type: "web_url" })
    this.editStory()
  }

}
