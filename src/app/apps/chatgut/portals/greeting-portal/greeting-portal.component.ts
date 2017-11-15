import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import { PortalContainerComponent } from '../portal-container/portal-container.component'
@Component({
  selector: 'app-greeting-portal',
  templateUrl: './greeting-portal.component.html',
  styleUrls: ['./greeting-portal.component.scss']
})
export class GreetingPortalComponent extends BasePortal implements OnInit {

  constructor(
    @Host() container: PortalContainerComponent,
    private zone: NgZone
  ) { 
    super(container)
  }

  ngOnInit() {
  }

}
