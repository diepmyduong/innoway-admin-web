import { Component, OnInit, Host, Input } from '@angular/core';
import { BaseButton } from '../button-container/base-button'
import { ButtonContainerComponent } from '../button-container/button-container.component'
import { StoriesPortalComponent } from '../../portals'
@Component({
  selector: 'app-location-quick-reply-button',
  templateUrl: './location-quick-reply-button.component.html',
  styleUrls: ['./location-quick-reply-button.component.scss']
})
export class LocationQuickReplyButtonComponent extends BaseButton implements OnInit {

  constructor(
    @Host() container: ButtonContainerComponent
  ) {
    super(container)
  }
  locationIcon = "http://files.softicons.com/download/web-icons/awt-travel-blue-icons-by-awt-media/png/200x200/AWT-Location.png"

  ngOnInit() {
  }

}
