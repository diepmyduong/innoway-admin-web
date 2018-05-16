import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "app/services/innoway";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';

@Component({
  selector: 'app-setting-layout',
  providers: [Globals],
  templateUrl: './setting-layout.component.html',
  styleUrls: ['./setting-layout.component.scss']
})

export class SettingLayoutComponent implements OnInit {

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

  itemFields: any = ['$all', {
    activities: ['$all', {
      employee: ['$all']
    }],
    bill_ship_detail: ['$all'],
    items: ['$all', {
      Branch: ['$all', '$paranoid'],
      topping_values: ['$all', '$paranoid']
    }],
    customer: ['$all'],
    activity: ['$all']
  }];

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
      type: 'single',
      name: 'Thiết lập',
      link: "./settings/config",
      icon: 'fa fa-cog',
    },
    {
      type: 'single',
      name: 'Giao diện',
      link: "./settings/theme",
      icon: 'fa fa-adjust',
    },
    {
      type: 'single',
      name: 'Trạng thái',
      link: "./settings/message",
      icon: 'fa fa-calendar',
    },
    {
      type: 'parent',
      name: 'Khu vực',
      icon: 'fa fa-location-arrow',
      children: [
        {
          name: 'Thêm',
          link: "./area/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./area/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Phí ship',
      icon: 'fa fa-usd',
      children: [
        {
          name: 'Xem',
          link: "./ship/detail",
          icon: 'icon-eye'
        },
        {
          name: 'Sửa',
          link: "./ship/add",
          icon: 'fa fa-edit'
        }
      ]
    },
    {
      type: 'single',
      name: 'Kết nối chatbot',
      link: "./integration/chatbot",
      icon: 'fa fa-dot-circle-o',
    },
    {
      type: 'parent',
      name: 'Kết nối thirdparty',
      icon: 'fa fa-usd',
      children: [
        {
          name: 'Haravan',
          link: "./integration/haravan",
          icon: 'fa fa-edit'
        },
        {
          name: 'KiotViet',
          link: "./integration/kiotviet",
          icon: 'fa fa-edit'
        },
        {
          name: 'Giao hàng nhanh',
          link: "./integration/ghn",
          icon: 'fa fa-edit'
        },
        {
          name: 'Giao hàng tiết kiệm',
          link: "./integration/ghtk",
          icon: 'fa fa-edit'
        },
      ]
    },
  ];


  thirdparty = [
    {
      name: "Giao hàng tiết kiệm",
      code: "GHTK",
      type: "ship",
      url: "https://i.imgur.com/7VvbMLT.png",
      link: ""
    },
    {
      name: "Giao hàng nhanh",
      code: "GHN",
      type: "ship",
      url: "https://i.imgur.com/Pj6j4PM.png",
      link: ""
    },
    {
      name: "KiotViet",
      code: "KIOTVIET",
      type: "data",
      url: "https://i.imgur.com/TwRwpNh.png",
      link: ""
    },
    {
      name: "Haravan",
      code: "HARAVAN",
      type: "data",
      url: "https://i.imgur.com/yMSgiNK.png",
      link: ""
    },
    {
      name: "MCOM Bot",
      code: "MCOM",
      type: "bot",
      url: "https://i.imgur.com/7JRFS05.png",
      link: ""
    }
  ]

  goToDashboardLayout() {
    this.router.navigate(['/dashboard-layout'], { relativeTo: this.route });
  }

  goToCustomerLayout() {
    this.router.navigate(['/customer-layout'], { relativeTo: this.route });
  }

  goToEmployeeLayout() {
    this.router.navigate(['/employee-layout'], { relativeTo: this.route });
  }

  goToProductLayout() {
    this.router.navigate(['/product-layout'], { relativeTo: this.route });
  }

  goToPromotionLayout() {
    this.router.navigate(['/promotion-layout'], { relativeTo: this.route });
  }

  goToBillLayout() {
    this.router.navigate(['/bill-layout'], { relativeTo: this.route });
  }

  goToSettingLayout() {
    this.router.navigate(['/setting-layout'], { relativeTo: this.route });
  }

  goToPOSLayout() {
    this.router.navigate(['/pos'], { relativeTo: this.route });
  }

}
