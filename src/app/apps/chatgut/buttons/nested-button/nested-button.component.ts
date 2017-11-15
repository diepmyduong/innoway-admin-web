import { Component, OnInit, Host, Input, EventEmitter, Output } from '@angular/core'
import { BaseButton } from '../button-container/base-button'
import { ButtonContainerComponent } from '../button-container/button-container.component'
@Component({
  selector: 'app-nested-button',
  templateUrl: './nested-button.component.html',
  styleUrls: ['./nested-button.component.scss']
})
export class NestedButtonComponent extends BaseButton implements OnInit {

  
  constructor(
    @Host() container: ButtonContainerComponent
  ) { 
    super(container)
  }
  subMenu:any = [{
    type: "web_url",
    title: "URL",
    url: "https://google.com"
  },{
    type: "postback",
    title: "POST BACK",
    story: {
      id: "1"
    }
  }]

  ngOnInit() {
  }

  async defaultAction() {
    super.defaultAction({ type: "nested" })
  }

}
