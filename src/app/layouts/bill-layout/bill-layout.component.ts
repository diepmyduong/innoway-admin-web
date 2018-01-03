import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "app/services/innoway";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';

@Component({
  selector: 'app-bill-layout',
  providers: [Globals],
  templateUrl: './bill-layout.component.html',
  styleUrls: ['./bill-layout.component.scss']
})

export class BillLayoutComponent implements OnInit {

  employee: any;
  branch: any;

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  billService: any;
  billActitivyService: any;
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

  }

  async showBillContent(bill) {
    this.zone.run(() => {
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
      name: 'Đơn hàng',
      icon: 'fa fa-file-text-o',
      children: [
        {
          name: 'Thêm',
          link: "../pos",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./bill/list",
          icon: 'fa fa-list-ul'
        },
        // {
        //   name: 'Lịch sử hoạt động',
        //   // link: "./bill/list",
        //   icon: 'fa fa-send'
        // }
      ]
    },
    // {
    //   type: 'parent',
    //   name: 'Thanh toán',
    //   icon: 'fa fa-file-text-o',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       // link: "./bill/list",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       // link: "./bill/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // }
  ];

}
