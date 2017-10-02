import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService, InnowayService } from "app/services";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit {

  prefix = '/super-admin'

  employee: any;
  branch: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    public innoway: InnowayService,
    private ref: ChangeDetectorRef,
    public auth: AuthService) {
    this.employee = this.auth.service.userInfo;
  }

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
    alert(open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void { }

  logout(){
    this.auth.service.logout();
  }

}
