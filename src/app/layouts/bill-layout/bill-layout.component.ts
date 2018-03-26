import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "app/services/innoway";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';
import { Subscription } from "rxjs/Subscription";

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
  subscriptions: Subscription[] = []

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    tapToDismiss: true,
    timeout: 5000
  });

  constructor(private router: Router,
    private route: ActivatedRoute,
    public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    toasterService: ToasterService,
    private zone: NgZone
  ) {
    this.toasterService = toasterService;
  }

  async ngOnInit() {
    this.employee = this.innowayApi.innowayAuth.innowayUser
    this.loadBranchByEmployeeData(this.employee.branch_id)

    this.subscribeTopicByFCM()
  }

  async showBillContent(bill) {
    this.zone.run(() => {
      let toast = this.toasterService.pop('success', 'Đơn hàng: ' + bill.id, "Đơn hàng " + this.globals.detectNameCurrentActivityOnBill(bill.activity.action));
    })
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
      ]
    },
  ];

  async loadBranchByEmployeeData(branchId: string) {
    try {
      this.branch = await this.innowayApi.branch.getItem(branchId, {
        query: { fields: ["$all"] }
      })
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  showNotification(notification: any) {
    this.toasterService.pop(notification.type, notification.title, notification.content);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  async subscribeTopicByFCM() {
    this.billChangeObservable = await this.innowayApi.bill.subscribe()
    this.subscriptions.push(this.billChangeObservable.subscribe(message => {
      try {
        console.log("subscribeTopicByFCM", JSON.stringify(message))
        let title;
        let content;
        switch (message.topic) {
          case 'order_at_store':
          case 'order_online_by_employee':
          case 'order_online_by_customer':
          case 'update_subfee':
          case 'update_paid_history':
          case 'cancel_bill':
          case 'change_bill_activity':
            this.showInformationAboutBillFromFCM(message)
            break;
        }
      }
      catch (err) {
        console.log("subscribeTopicByFCM", err);
      }
    }));
  }

  async showInformationAboutBillFromFCM(message: any) {
    try {
      let data = await this.innowayApi.bill.getItem(message.bill_id, {
        query: {
          fields: ["$all", {
            activity: ['$all', {
              employee: ['$all']
            }],
            paid_history: ['$all', {
              employee: ['$all']
            }],
            customer: ["$all"]
          }]
        }
      })
      console.log("loadBill", JSON.stringify(data))
      switch (message.topic) {
        case 'order_at_store': {
          this.showNotification({
            type: 'success',
            title: 'Đơn hàng ' + data.code + ' đặt thành công',
            content: 'Đơn hàng được đặt tại chi nhánh ' + this.branch.name
          })
          break;
        }
        case 'order_online_by_employee': {
          this.showNotification({
            type: 'success',
            title: 'Đơn hàng ' + data.code + ' đặt thành công',
            content: 'Đơn hàng cần giao đến ' + data.address + ' bởi nhân viên ' + data.activity.employee.fullname
          })
          break;
        }
        case 'order_online_by_customer': {
          this.showNotification({
            type: 'success',
            title: 'Đơn hàng ' + data.code + ' được đặt thành công',
            content: 'Đơn hàng được đặt tại chi nhánh ' + this.branch.name + ' bởi nhân viên ' + data.customer.fullname
          })
          break;
        }
        case 'update_subfee': {
          this.showNotification({
            type: 'success',
            title: 'Đơn hàng ' + data.code + ' thay đổi phụ phí',
            content: 'Đơn hàng vừa được khách hàng cập nhật phụ phí ' + message.price.toString() + ' được ghi nhận bởi ' + data.activity.employee.fullname
          })
          break;
        }
        case 'update_paid_history': {
          this.showNotification({
            type: 'success',
            title: 'Đơn hàng ' + data.code + ' thay đổi tiền thanh toán',
            content: 'Đơn hàng vừa được khách hàng ' + data.customer.fullname + ' trả ' + message.pay_amount + ' được ghi nhận bởi ' + data.paid_history.employee.fullname
          })
          break;
        }
        case 'cancel_bill': {
          this.showNotification({
            type: 'warning',
            title: 'Đơn hàng ' + data.code + ' đã hủy',
            content: 'Đơn hàng vừa bị hủy, được xác nhận bởi nhân viên ' + data.activity.employee.fullname
          })
          break;
        }
        case 'change_bill_activity': {
          if (data.activity.action.indexOf("CANCEL") == -1) {
            this.showNotification({
              type: 'success',
              title: 'Đơn hàng ' + data.code + ' cập nhật trạng thái',
              content: 'Đơn hàng vừa được thay đổi sang trạng thái ' + '\"' + this.globals.detectBillActivityByCode(data.activity.action) + '\"' + ' bởi nhân viên ' + data.activity.employee.fullname
            })
          }
          break;
        }
      }
    } catch (err) {

    }
  }

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
