import { Component, OnInit, Input, Output, EventEmitter, Host } from '@angular/core';
import { WhiteListPortalComponent } from '../white-list-portal.component'
@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  @Input() url: string
  constructor(
    @Host() public whiteList: WhiteListPortalComponent
  ) { }

  ngOnInit() {
  }

}
