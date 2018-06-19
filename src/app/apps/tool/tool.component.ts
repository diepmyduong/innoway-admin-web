import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { Globals } from "app/globals";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from 'rxjs/Subscription'
import { IntroService } from "app/services/intro.service";
import { ENTER } from '@angular/cdk/keycodes'

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {

  data: any = {
    feature: [
      {
        title: "Thiết lập",
        icon: "/assets/img/tools/settings.svg",
        link: "/setting-layout",
        hint: "Thiết lập kinh doanh",
        id: "setting-id"
      },
      {
        title: "Trang điều phối",
        icon: "/assets/img/tools/dashboard.svg",
        link: "/dashboard-layout",
        hint: "Điều phối hoạt động",
        id: "dashboard-id"
      }, {
        title: "Chi nhánh",
        icon: "/assets/img/tools/branch.svg",
        link: "/branch-layout",
        hint: "Quản lý chi nhánh",
        id: "branch-id"
      },
      {
        title: "Nhân viên",
        icon: "/assets/img/tools/employee.svg",
        link: "/employee-layout",
        hint: "Quản lý nhân viên",
        id: "employee-id"
      }, {
        title: "Sản phẩm",
        icon: "/assets/img/tools/product.svg",
        link: "/product-layout",
        hint: "Quản lý sản phẩm",
        id: "product-id"
      }, {
        title: "Khách hàng",
        icon: "/assets/img/tools/customer.svg",
        link: "/customer-layout",
        hint: "Quản lý khách hàng",
        id: "customer-id"
      }, {
        title: "Đơn hàng",
        icon: "/assets/img/tools/bill.svg",
        link: "/bill-layout",
        hint: "Quản lý đơn hàng",
        id: "bill-id"
      }, {
        title: "Khuyến mãi",
        icon: "/assets/img/tools/promotion.svg",
        link: "/promotion-layout",
        hint: "Thiết lập ưu đãi",
        id: "promotion-id"
      }, {
        title: "POS",
        icon: "assets/img/tools/pos.svg",
        link: "/pos",
        hint: "Hỗ trợ bán hàng",
        id: "pos-id"
      },
      // {
      //   title: "Thống kê",
      //   icon: "https://farm5.staticflickr.com/4528/24866458148_a12c9693af_o.png",
      //   link: "/summary-layout",
      //   hint: "thống kê quy trình kinh doanh",
      //   id: "summary-id"
      // }
      // , {
      //   title: "Phản hồi",
      //   icon: "https://farm5.staticflickr.com/4558/38018892994_1ef6928909_o.png",
      //   link: "/feedback-layout",
      // }, {
      //   title: "Ticket",
      //   icon: "https://farm5.staticflickr.com/4586/37848509095_91f1c6899d_o.png",
      //   link: "/ticket-layout",
      // }
    ],
    addon: [
      {
        title: "Thống kê",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/summary-layout",
      }, {
        title: "Báo cáo",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/report-layout",
      }, {
        title: "Phân tích",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/analyse-layout",
      }, {
        title: "Khảo sát",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/survey-layout",
      }, {
        title: "Sự kiện",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/event-layout",
      }, {
        title: "Tích hợp AI",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-apiai-layout",
      }, {
        title: "Tích hợp KiotViet",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-kiotviet-layout",
      }, {
        title: "Tích hợp Chatbot",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-chatbot-layout",
      }
    ]
  }

  billChangeObservable: BehaviorSubject<any> = new BehaviorSubject<any>({});
  branch: any = {}
  subscriptions: Subscription[] = []
  introInstance: any

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
    public intro: IntroService
  ) {
    this.data.feature.forEach(f => {
      f.style = {
        "mask-image": 'url(' + f.icon + ')',
        "-webkit-mask-image": 'url(' + f.icon + ')',
      }
    })
    this.toasterService = toasterService;

  }

  runIntro() {
    this.introInstance = this.intro.getInstance([
      {
        'click #setting-id': 'Thiết lập quy trình kinh doanh của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
      {
        'click #branch-id': 'Quản lý chi nhánh của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
      {
        'click #product-id': 'Quản lý sản phẩm của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
      {
        'click #employee-id': 'Quản lý nhân viên của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
      {
        'click #customer-id': 'Quản lý khách hàng của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
      {
        'click #bill-id': 'Quản lý đơn hàng của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
      {
        'click #promotion-id': 'Quản lý khuyến mãi của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
      {
        'click #pos-id': 'Trang bán hàng của doanh nghiệp',
        'nextButton': { className: "myNext", text: "Tiếp" },
        'skipButton': { className: "mySkip", text: "Bỏ qua" },
        showSkip: true,
        showNext: true
      },
    ])

    this.introInstance.run()
  }

  ngOnInit() {
    let employee = this.innowayApi.innowayAuth.innowayUser
    // this.subscribeTopicByFCM()
    // this.loadBranchByEmployeeData(employee.branch_id)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  ngAfterViewInit() {
    // this.runIntro()
  }

  // async loadBranchByEmployeeData(branchId: string) {
  //   try {
  //     this.branch = await this.innowayApi.branch.getItem(branchId, {
  //       query: { fields: ["$all"] }
  //     })
  //     this.ref.detectChanges();
  //   } catch (err) {

  //   }
  // }

  // showNotification(notification: any) {
  //   this.toasterService.pop(notification.type, notification.title, notification.content);
  // }

  // async subscribeTopicByFCM() {
  //   this.subscriptions.push(this.innowayApi.bill.onInformationBillFromFCM.subscribe(message => {
  //     if (!message) return
  //     try {
  //       console.log("subscribeTopicByFCM", JSON.stringify(message))
  //       switch (message.topic) {
  //         case 'order_at_store':
  //         case 'order_online_by_employee':
  //         case 'order_online_by_customer':
  //         case 'update_subfee':
  //         case 'update_paid_history':
  //         case 'cancel_bill':
  //         case 'change_bill_activity':
  //           this.showInformationAboutBillFromFCM(message)
  //           break;
  //       }
  //     }
  //     catch (err) {
  //       console.log("subscribeTopicByFCM", err);
  //     }
  //   }));
  // }

  // async showInformationAboutBillFromFCM(message: any) {
  //   try {
  //     let data = await this.innowayApi.bill.getItem(message.bill_id, {
  //       query: {
  //         fields: ["$all", {
  //           activity: ['$all', {
  //             employee: ['$all']
  //           }],
  //           paid_history: ['$all', {
  //             employee: ['$all']
  //           }],
  //           customer: ["$all"]
  //         }]
  //       }
  //     })
  //     console.log("loadBill", JSON.stringify(data))
  //     switch (message.topic) {
  //       case 'order_at_store': {
  //         this.showNotification({
  //           type: 'success',
  //           title: 'Đơn hàng ' + data.code + ' đặt thành công',
  //           content: 'Đơn hàng được đặt tại chi nhánh ' + this.branch.name
  //         })
  //         break;
  //       }
  //       case 'order_online_by_employee': {
  //         this.showNotification({
  //           type: 'success',
  //           title: 'Đơn hàng ' + data.code + ' đặt thành công',
  //           content: 'Đơn hàng cần giao đến ' + data.address + ' bởi nhân viên ' + data.activity.employee.fullname
  //         })
  //         break;
  //       }
  //       case 'order_online_by_customer': {
  //         this.showNotification({
  //           type: 'success',
  //           title: 'Đơn hàng ' + data.code + ' được đặt thành công',
  //           content: 'Đơn hàng được đặt tại chi nhánh ' + this.branch.name + ' bởi nhân viên ' + data.customer.fullname
  //         })
  //         break;
  //       }
  //       case 'update_subfee': {
  //         this.showNotification({
  //           type: 'success',
  //           title: 'Đơn hàng ' + data.code + ' thay đổi phụ phí',
  //           content: 'Đơn hàng vừa được khách hàng cập nhật phụ phí ' + message.price.toString() + ' được ghi nhận bởi ' + data.activity.employee.fullname
  //         })
  //         break;
  //       }
  //       case 'update_paid_history': {
  //         this.showNotification({
  //           type: 'success',
  //           title: 'Đơn hàng ' + data.code + ' thay đổi tiền thanh toán',
  //           content: 'Đơn hàng vừa được khách hàng ' + data.customer.fullname + ' trả ' + message.pay_amount + ' được ghi nhận bởi ' + data.paid_history.employee.fullname
  //         })
  //         break;
  //       }
  //       case 'cancel_bill': {
  //         this.showNotification({
  //           type: 'warning',
  //           title: 'Đơn hàng ' + data.code + ' đã hủy',
  //           content: 'Đơn hàng vừa bị hủy, được xác nhận bởi nhân viên ' + data.activity.employee.fullname
  //         })
  //         break;
  //       }
  //       case 'change_bill_activity': {
  //         if (data.activity.action.indexOf("CANCEL") == -1) {
  //           this.showNotification({
  //             type: 'success',
  //             title: 'Đơn hàng ' + data.code + ' cập nhật trạng thái',
  //             content: 'Đơn hàng vừa được thay đổi sang trạng thái ' + '\"' + this.globals.detectBillActivityByCode(data.activity.action) + '\"' + ' bởi nhân viên ' + data.activity.employee.fullname
  //           })
  //         }
  //         break;
  //       }
  //     }
  //   } catch (err) {

  //   }
  // }

}
