import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "app/services/innoway";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';

@Component({
  selector: 'app-customer-layout',
  providers: [Globals],
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.scss']
})

export class CustomerLayoutComponent implements OnInit {

  employee: any;
  branch: any;

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  billChangeObservable: Observable<any>;
  subscribers: any = {};

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig = new ToasterConfig({
    tapToDismiss: false,
    timeout: 2000
  });

  constructor(private router: Router,
    private route: ActivatedRoute,
    public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    toasterService: ToasterService,
    private zone: NgZone
  ) {
    this.employee = this.innowayApi.innowayAuth.innowayUser;
    this.toasterService = toasterService;
  }

  async ngOnInit() {
    this.subscribeTopicByFCM();
    console.log("bambi: " + JSON.stringify(this.employee));
  }

  async subscribeTopicByFCM() {

  }

  async showBillContent(bill) {
    this.zone.run(()=>{
      let toast = this.toasterService.pop('success', 'Đơn hàng: ' + bill.id, "Đơn hàng " + this.globals.detectNameCurrentActivityOnBill(bill.activity.action));
    })
  }

  showSuccess() {
    console.log("bambi showSuccess()");
    this.toasterService.pop('success', 'Success Toaster', 'This is toaster description');
    this.ref.detectChanges();
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
    alert(open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  logout() {
    this.innowayApi.innowayAuth.logout();
  }

  navigations = [
    {
      type: 'parent',
      name: 'Người dùng',
      icon: 'fa fa-user-o',
      children: [
        {
          name: 'Thêm',
          link: "./customer/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./customer/list",
          icon: 'icon-menu'
        }
      ],
    },
    {
      type: 'parent',
      name: 'Loại người dùng',
      icon: 'fa fa-user-o',
      children: [
        {
          name: 'Thêm',
          link: "./customer-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./customer-type/list",
          icon: 'icon-menu'
        }
      ],
    }
  ];

}
