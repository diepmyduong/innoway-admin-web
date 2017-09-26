import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { InnowayService, AuthService } from "app/services";
import * as Ajv from 'ajv';

declare var swal: any;

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  itemFields: any = ["$all", {
    customer: ["phone"],
    activities: ["action"],
    bill_ship_detail: ["fee"]
  }];

  action: number = 1;
  actions: any[] = [
    {
      action: -2,
      name: "Chỉnh sửa"
    },
    {
      action: -1,
      name: "Đã hủy"
    },
    {
      action: 0,
      name: "Đặt hàng thành công"
    },
    {
      action: 1,
      name: "Đang điều phối"
    },
    {
      action: 2,
      name: "Đang xử lý"
    },
    {
      action: 3,
      name: "Đã chuẩn bị"
    },
    {
      action: 4,
      name: "Đã chuyển cho giao hàng"
    },
    {
      action: 5,
      name: "Đang giao"
    },
    {
      action: 6,
      name: "Đã thanh toán"
    },
    {
      action: 7,
      name: "Đã thu tiền"
    },
  ];

  billService: any;
  billActitivyService: any;
  bills: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  employees: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  areas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  thumbDefault: string = "https://s11.favim.com/mini/160421/snowball-movie-the-secret-life-of-pets-cute-Favim.com-4234326.jpeg";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public innoway: InnowayService,
    private ref: ChangeDetectorRef,
    public auth: AuthService
  ) {

    this.billService = innoway.getService('bill');
    this.billActitivyService = innoway.getService('bill_activity');
  }

  async ngOnInit() {
    this.loadBillData();
    // alert(JSON.stringify(this.auth.service.userInfo,null,2))
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printSection').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
            <html>
                <head>
                    <title>Print tab</title>
                    <style>
                        //........Customized style.......
                    </style>
                </head>
                <body onload="window.print();window.close()">${printContents}
                </body>
            </html>`
    );
    popupWin.document.close();
  }

  async loadEmployeeData() {
    try {
      this.bills = await this.innoway.getAll('bill', {
        fields: ["$all", {
          activities: ["$all", {
            employee: ["$all"]
          }],
          customer: ["$all"]
        }]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadBranchData() {

  }

  async loadAreaData() {

  }

  async queryBill(query: string) {

  }

  async loadBillData() {
    try {
      this.bills = await this.innoway.getAll('bill', {
        fields: ["$all", {
          activities: ["$all", {
            employee: ["$all"]
          }],
          customer: ["$all"]
        }]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  viewDetail(bill) {
    this.router.navigate(['../bills/', bill.id], { relativeTo: this.route });
  }

  detectChannelName(channel): string {
    let result = "";
    switch (Number.parseInt(channel)) {
      case 0: {
        result = "Tại chi nhánh"
        break;
      }
      case 1: {
        result = "Callcenter"
        break;
      }
      case 2: {
        result = "Facebook"
        break;
      }
      case 3: {
        result = "Chatbot"
        break;
      }
      case 4: {
        result = "Website"
        break;
      }
      case 5: {
        result = "Ứng dụng di động"
        break;
      }
      case 6: {
        result = "Thirdparty"
        break;
      }
    }
    return result;
  }

  detectActionName(action): string {
    let result = "";
    switch (Number.parseInt(action)) {
      case -2: {
        result = "Chỉnh sửa";
        break;
      }
      case -1: {
        result = "Đã hủy";
        break;
      }
      case 0: {
        result = "Đặt hàng thành công";
        break;
      }
      case 1: {
        result = "Đang điều phối";
        break;
      }
      case 2: {
        result = "Đang xử lý";
        break;
      }
      case 3: {
        result = "Đã chuẩn bị";
        break;
      }
      case 4: {
        result = "Đã chuyển cho giao hàng";
        break;
      }
      case 5: {
        result = "Đang giao";
        break;
      }
      case 6: {
        result = "Đã thanh toán";
        break;
      }
      case 7: {
        result = "Đã thu tiền";
        break;
      }
    }
    return result;
  }

  async changeStatusBill(bill) {

    let options = [
      { '-2': 'Chỉnh sửa' },
      { '-1': ' Đã hủy' },
      { '0': 'Đặt hàng thành công' },
      { '1': 'Đang điều phối' },
      { '2': 'Đang xử lý' },
      { '3': 'Đã chuẩn bị' },
      { '4': 'Đã chuyển cho giao hàng' },
      { '5': 'Đang giao' },
      { '6': 'Đã thanh toán' },
      { '7': 'Đã thu tiền' }
    ];

    let avaiavle_options = {};

    options.forEach(option => {
      if (Object.keys(option) > bill.activities[bill.activities.length - 1].action) {
        avaiavle_options = $.extend(avaiavle_options, option);
      }
    });

    let result = await swal({
      title: 'Chọn trạng thái',
      input: 'select',
      inputOptions: avaiavle_options,
      inputPlaceholder: 'Chọn trạng thái',
      showCancelButton: true,
      inputValidator: function(value) {
        return new Promise(function(resolve, reject) {
          resolve();
        })
      }
    })

    await swal({
      type: 'success',
      html: 'Cập nhật trạng thái: ' + this.detectActionName(result)
    })
    this.updateAction(bill, Number.parseInt(result));
  }

  async updateAction(bill, action: number) {
    try {
      let bill_id = bill.id;
      let employee_id;
      await this.billActitivyService.add({ bill_id, action })
      this.alertAddSuccess();
      this.bills = new BehaviorSubject<any[]>([]);
      this.loadBillData();
    }
    catch (err) {
      this.alertAddFailed();
    }
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  alertAddSuccess() {
    return swal({
      title: 'Cập nhật thành công',
      type: 'success',
      timer: 2000,
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    })
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    })
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

}
