import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { InnowayService, AuthService } from "app/services";
import * as Ajv from 'ajv';
import * as _ from 'lodash';
import { DashboardService } from "app/apps/dashboard/DashboardService";

import { Globals } from './../../../globals';
declare let swal:any;

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  providers: [Globals],
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  itemFields: any = ["$all", {
    customer: ["phone"],
    activities: ["action"],
    bill_ship_detail: ["fee"]
  }];

  subscribers: any = {}

  action: number = 1;

  processColor: string = "#3498db";
  successColor: string = "#2ecc71";
  cancelColor: string = "#e74c3c";

  billService: any;
  billActitivyService: any;
  billChangeObservable: Observable<any>;
  bills: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  employees: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  areas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  thumbDefault: string = "https://s11.favim.com/mini/160421/snowball-movie-the-secret-life-of-pets-cute-Favim.com-4234326.jpeg";
  actionSubscription: Subscription;
  selectedAction: number = -1;
  selectedEmployee: string;
  selectedArea: number = 0;
  selectedCustomer: string;
  selectedBill: string;

  constructor(
    private globals: Globals,
    private router: Router,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    public innoway: InnowayService,
    private ref: ChangeDetectorRef,
    public auth: AuthService,
    public zone: NgZone
  ) {
    this.billService = innoway.getService('bill');
    this.billActitivyService = innoway.getService('bill_activity');

    // this.subscribeDashboardParent();
  }

  async ngOnInit() {
    this.loadBillData();
    // this.subscribeTopicByFCM();
  }

  private subscribeDashboardParent() {
    this.dashboardService.selectedAction.subscribe(
      data => {
        this.selectedAction = data;
      });

    this.dashboardService.selectedEmployee.subscribe(
      data => {
        this.selectedEmployee = data;
      });

    this.dashboardService.selectedArea.subscribe(
      data => {
        this.selectedArea = data;
      });

    this.dashboardService.selectedCustomer.subscribe(
      data => {
        this.selectedCustomer = data;
      });

    this.dashboardService.selectedBill.subscribe(
      data => {
        this.selectedBill = data;
      });
  }

  async subscribeTopicByFCM() {
    this.billChangeObservable = await this.billService.subscribe();
    this.subscribers.bill = this.billChangeObservable.subscribe(data => {
      // this.onBillChange.bind(this)
    });
  }

  async ngOnDestroy() {
    console.log('on destroy')
    _.forEach(this.subscribers, (subscription: Subscription) => {
      subscription.unsubscribe()
    })
  }

  async onBillChange(bill) {
    let item = await this.billService.get(bill.id, {
      fields: ["$all", {
        activities: ["$all", {
          employee: ["$all"]
        }],
        customer: ["$all"]
      }]
    })
    console.log('on bill change', item)
    let bills = this.bills.getValue()
    bills.unshift(item)
    this.zone.run(() => {
      this.bills.next(bills)
    })

  }

  async print(bill) {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    this.loadDetailedBill(bill.id, true, popupWin);

  }

  async loadDetailedBill(id: string, isPrint: boolean, popupWin: any) {
    try {
      let data = await this.billService.get(id, {
        fields: ["$all", {
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
        }]
      });
      if (isPrint && data.items != null) {
        this.printBill(data, popupWin);
      }
    } catch (err) {
      this.alertItemNotFound()
      // alert(err);
    }
  }

  async printBill(data: any, popupWin: any) {
    let printContents, billContent;
    printContents = "";
    printContents =
      '<div> Mã đơn hàng: ' + data.id + '</div>'
      ;
    billContent = '';

    data.items.forEach(item => {
      billContent += '<p>' + item.product.name + ' --- ' + item.amount + '</p>'
    });

    printContents += billContent;

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
          customer: ["$all"],
          activity: ["$all"]
        }],
        order: [["updated_at", "desc"]]
      });
      // alert(JSON.stringify(this.bills));
      console.log('bills', this.bills.getValue())
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
    result = this.globals.detectChannelByCode(channel);
    return result;
  }

  detectActionName(action): string {
    let result = "";
    result = this.globals.detectBillActivityByCode(action);
    return result;
  }

  async changeStatusBill(bill) {
    let avaiavle_options = {};
    let options = this.globals.avaibleBillActivityOption(bill.activity ? bill.activity.action : '');

    options.forEach(option => {
      avaiavle_options = $.extend(avaiavle_options, option);
    });

    let action;
    let result = await swal({
      title: 'Chọn trạng thái',
      input: 'select',
      inputOptions: avaiavle_options,
      inputPlaceholder: 'Chọn trạng thái',
      showCancelButton: true,
      inputValidator: function(value) {
        return new Promise(function(resolve, reject) {
          action = value;
          resolve();
        })
      }
    })
    console.log("result",result)

    await swal({
      type: 'success',
      html: 'Cập nhật trạng thái: ' + this.detectActionName(result)
    })
    this.updateAction(bill, action);
  }

  async updateAction(bill, action) {
    console.log("bambi: updateAction " + bill.id + " ---- " + action);
    try {
      let bill_id = bill.id;
      let data = {
        activity: action,
        note: '',
      };
      // await this.billActitivyService.add({ bill_id, action });
      await this.billService.changeActivity(bill_id, data);
      this.alertAddSuccess();
      this.bills = new BehaviorSubject<any[]>([]);
      this.loadBillData();
    }
    catch (err) {
      console.log("bambi: " + err.toString());
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

  async filter(action) {
    try {
      console.log('action', action)
      this.bills = new BehaviorSubject<any[]>([]);
      let query = {
        fields: ["$all", {
          // activities: ["action",
          //   // {
          //   //   employee: ["$all"]
          //   // }
          // ],
          customer: ["$all"],
          activity: ["action"]
        }],
        filter: {
          "$activity.action$": action
        }
      }
      console.log('query', query)
      this.bills = await this.innoway.getAll('bill', query);
      console.log('bills', this.bills.getValue())
      // alert(JSON.stringify(this.bills));
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  //set a property that holds a random color for our style.
  randomcolor = this.getRandomColor();

  //function to get random colors
  public getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  //function to set a new random color
  setColor() {
    this.randomcolor = this.getRandomColor();
  }

  someProperty = true;
  anotherProperty = true;

  setClasses(index: number) {
    let classes1 = {
      extraclass: this.someProperty,
    };
    let classes2 = {
      anotherclass: this.anotherProperty,
    };
    return index % 2 == 0 ? classes1 : classes2;
  }

  setStyles() {
    let styles = {
      // CSS property names
      'font-style': this.someProperty ? 'italic' : 'normal',     // italic
      'font-weight': this.anotherProperty ? 'bold' : 'normal',  // normal
    };
    return styles;
  }

}
