import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import { PortalContainerComponent } from '../portal-container/portal-container.component'
import * as Cards from '../../cards'
@Component({
  selector: 'app-menu-portal',
  templateUrl: './menu-portal.component.html',
  styleUrls: ['./menu-portal.component.scss']
})
export class MenuPortalComponent extends BasePortal implements OnInit {

  @ViewChild("cardContainer", { read: Cards.CardContainerComponent }) cardContainer: Cards.CardContainerComponent
  constructor(
    @Host() container: PortalContainerComponent,
    private zone: NgZone
  ) { 
    super(container)
  }

  ngOnInit() {
    this.cardContainer.pushCardComp(Cards.MenuCardComponent)
  }

  

}
