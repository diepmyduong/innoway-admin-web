import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { Globals } from "app/globals";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
        icon: "https://farm5.staticflickr.com/4521/38018892844_81b009a668_o.png",
        link: "/setting-layout",
      },
      {
        title: "Trang điều phối",
        icon: "https://farm5.staticflickr.com/4574/38018893524_94f1d2622b_o.png",
        link: "/dashboard-layout",
      }, {
        title: "Chi nhánh",
        icon: "https://farm5.staticflickr.com/4536/38018893464_2243305580_o.png",
        link: "/branch-layout",
      },
      {
        title: "Nhân viên",
        icon: "https://farm5.staticflickr.com/4533/38018893334_5e118b5f3f_o.png",
        link: "/employee-layout",
      }, {
        title: "Sản phẩm",
        icon: "https://farm5.staticflickr.com/4573/38018893214_d3fa023850_o.png",
        link: "/product-layout",
      }, {
        title: "Người dùng",
        icon: "https://farm5.staticflickr.com/4537/38018893194_f8e3a08b37_o.png",
        link: "/customer-layout",
      }, {
        title: "Đơn hàng",
        icon: "https://farm5.staticflickr.com/4567/38018893154_5db60221a1_o.png",
        link: "/bill-layout",
      }, {
        title: "Khuyến mãi",
        icon: "https://farm5.staticflickr.com/4585/38018893044_97c6c9f5ed_o.png",
        link: "/promotion-layout",
      }, {
        title: "POS",
        icon: "https://farm5.staticflickr.com/4528/24866458148_a12c9693af_o.png",
        link: "/pos",
      }
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
    toasterService: ToasterService) {

    this.toasterService = toasterService;

  }

  ngOnInit() {
    let employee = this.innowayApi.innowayAuth.innowayUser
    this.subscribeTopicByFCM()
    this.loadBranchByEmployeeData(employee.branch_id)
  }

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

  async subscribeTopicByFCM() {
    this.billChangeObservable = await this.innowayApi.bill.subscribe()
    this.billChangeObservable.subscribe(message => {
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
    });
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
            content: 'Đơn hàng vừa được khách hàng cập nhật phụ phí ' + message.price.toString() + ' được ghi nhận bởi ' +data.activity.employee.fullname
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

}
