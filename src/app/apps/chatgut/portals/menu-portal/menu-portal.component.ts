import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import { PortalContainerComponent } from '../portal-container/portal-container.component'
import * as Cards from '../../cards'
import { ChatbotApiService, iSetting } from 'app/services/chatbot'
@Component({
  selector: 'app-menu-portal',
  templateUrl: './menu-portal.component.html',
  styleUrls: ['./menu-portal.component.scss']
})
export class MenuPortalComponent extends BasePortal implements OnInit {
  @Input() settingId: string
  @ViewChild("cardContainer", { read: Cards.CardContainerComponent }) cardContainer: Cards.CardContainerComponent
  constructor(
    @Host() container: PortalContainerComponent,
    private zone: NgZone,
    public chatbotApi: ChatbotApiService
  ) { 
    super(container)
  }
  setting: iSetting

  async ngOnInit() {
    this.showLoading()
    this.setting = await this.chatbotApi.setting.getItem(this.settingId, {
      local: true, reload: true
    })
    this.hideLoading()
    this.cardContainer.pushCardComp(Cards.MenuCardComponent, { setting: this.setting })
  }
}
