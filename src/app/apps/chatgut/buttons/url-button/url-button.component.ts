import { Component, OnInit, Host, Input } from '@angular/core';
import { BaseButton } from '../button-container/base-button'
import { ButtonContainerComponent } from '../button-container/button-container.component'
@Component({
  selector: 'app-url-button',
  templateUrl: './url-button.component.html',
  styleUrls: ['./url-button.component.scss']
})
export class UrlButtonComponent extends BaseButton implements OnInit {

  constructor(
    @Host() container: ButtonContainerComponent
  ) { 
    super(container)
  }

  ngOnInit() {
  }

  async editUrl(){
    const url = await this.container.getUrlDialog(this.button.url)
    if(url != this.button.url) {
      this.button.url = url
      this.container.onButtonChange(this.index)
    }
    
  }

  async defaultAction() {
    super.defaultAction(this.button)
    this.editUrl()
  }

}
