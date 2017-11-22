import { Component, OnInit, ViewChild } from '@angular/core';
import * as Portals from './portals'
import { MatSidenav } from '@angular/material'
@Component({
  selector: 'app-chatgut',
  templateUrl: './chatgut.component.html',
  styleUrls: ['./chatgut.component.scss']
})
export class ChatgutComponent implements OnInit {

  @ViewChild("portalContainer") portalContainer: Portals.PortalContainerComponent
  @ViewChild("leftSidebar") leftSidebar: MatSidenav
  constructor() {
  }

  ngOnInit() {
    console.log(this.portalContainer)
  }

  openStoriesPortal(){
    // this.portalContainer.warpper.clear()
    this.portalContainer.clear()
    this.portalContainer.pushPortal(Portals.StoriesPortalComponent)
    this.leftSidebar.close()
  }

  openSettingsPortal(){
    this.portalContainer.clear()
    this.portalContainer.pushPortal(Portals.SettingsPortalComponent)
    this.leftSidebar.close()
  }

}
