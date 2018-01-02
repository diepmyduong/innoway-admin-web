import { Component, OnInit, ChangeDetectorRef, NgZone, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { InnowayApiService } from "app/services/innoway";
import * as Ajv from 'ajv';
import * as _ from 'lodash';
import { DashboardService } from "app/apps/dashboard/DashboardService";
import { MatDialog } from '@angular/material';
import { EditOrderStatusDialog } from "../../../modal/edit-order-status/edit-order-status.component";
import { ModalModule } from '../../../modal/modal.module';
import { SharedDataService } from '../../../services/shared-data/shared-data.service'

import { Globals } from './../../../globals';
import * as moment from 'moment';
import { Behavior } from 'ng2-select';
import { UpdatePaidHistoryDialog } from "../../../modal/update-paid-history/update-paid-history.component";
import { UpdateBillDataDialog } from "app/modal/update-bill-data/update-bill-data.component";
declare let swal: any;

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

  billChangeObservable: BehaviorSubject<any>;
  bills: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  employees: any[];
  areas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  thumbDefault: string = "https://s11.favim.com/mini/160421/snowball-movie-the-secret-life-of-pets-cute-Favim.com-4234326.jpeg";
  actionSubscription: Subscription;
  selectedAction: string;
  selectedEmployee: any;
  selectedArea: number = 0;
  selectedCustomer: any;
  selectedBill: any;
  selectedCustomerName: any;

  employeeData: any;
  branch: any;
  brand: any;

  get billFilterInfo(): any {
    return this.sharedDataService.billFilterInfo;
  }
  set billFilterInfo(value: any) {
    this.sharedDataService.billFilterInfo = value;
  }

  // get employees(): BehaviorSubject<any[]> {
  //   return this.sharedDataService.employees;
  // }
  //
  // set employees(value: BehaviorSubject<any[]>) {
  //   this.sharedDataService.employees = value;
  // }

  constructor(
    private globals: Globals,
    private router: Router,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
    public zone: NgZone,
    public dialog: MatDialog,
    public sharedDataService: SharedDataService
  ) {
    this.employeeData = this.innowayApi.innowayAuth.innowayUser
    //this.subscribeDashboardParent();
  }

  async ngOnInit() {
    this.loadBillData();
    this.loadBranchByEmployeeData(this.employeeData.branch_id);
    this.loadBrandByEmployeeData(this.employeeData.brand_id);
    this.loadEmployeeData();
    this.subscribeTopicByFCM();
  }

  async loadBrandByEmployeeData(brandId: string) {
    try {
      this.brand = await this.innowayApi.brand.getItem(brandId, {
        query: { fields: ["$all"] }
      })
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  onLoadDailySummary(value) {
    console.log("onLoadDailySummary");
    this.dashboardService.updateDailySummary(value);
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

  private subscribeDashboardParent() {
    this.dashboardService.selectedAction.subscribe(
      data => {
        this.selectedAction = data;
        if (this.selectedAction != null && this.selectedAction != '') {
          this.filter(this.selectedAction);
        }
      });

    this.dashboardService.selectedEmployee.subscribe(
      data => {
        this.selectedEmployee = data;
        if (this.selectedEmployee.id != null) {
          //this.filterByCustomerId(this.selectedEmployee.id);
        }
        // alert(JSON.stringify(data));
      });

    this.dashboardService.selectedArea.subscribe(
      data => {
        this.selectedArea = data;
      });

    this.dashboardService.selectedCustomer.subscribe(
      data => {
        this.selectedCustomer = data;
        if (this.selectedCustomer != null) {
          // alert(JSON.stringify(data));
          //this.filterByCustomerId(this.selectedCustomer.id);
          // this.filterByCustomerId(this.selectedCustomer.id);
        }
      });

    this.dashboardService.selectedCustomerName.subscribe(
      data => {
        this.selectedCustomerName = data;
        if (this.selectedCustomerName != null) {
          // alert(JSON.stringify(data));
          //this.filterByCustomerId(this.selectedCustomerName.id);
          // this.filterByCustomerId(this.selectedCustomerName.id);
        }
      });

    this.dashboardService.selectedBill.subscribe(
      data => {
        this.selectedBill = data;
      });
  }

  // async loadDailySummary() {
  //   try {
  //     let data = this.innowayApi.dailySummary.getList({
  //       query: {
  //         fields: ["$all"]
  //       }
  //     })
  //     console.log("bi-summary", JSON.stringify(data))
  //   } catch (err) {
  //     console.log("bi-summary", err)
  //   }
  // }

  async subscribeTopicByFCM() {
    this.billChangeObservable = await this.innowayApi.bill.subscribe()
    this.subscribers.bill = this.billChangeObservable.subscribe(data => {
      // this.onBillChange.bind(this)
      console.log("subscribeTopicByFCM", JSON.stringify(data))
    });
  }

  async ngOnDestroy() {
    console.log('on destroy')
    _.forEach(this.subscribers, (subscription: Subscription) => {
      subscription.unsubscribe()
    })
  }

  async onBillChange(bill) {
    let item = await this.innowayApi.bill.getItem(bill.id, {
      query: {
        fields: ["$all", {
          activities: ["$all", {
            employee: ["$all"]
          }],
          customer: ["$all"]
        }]
      }
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
      let data = await this.innowayApi.bill.getItem(id, {
        query: {
          fields: ["$all", {
            items: ['$all', {
              product: ['$all', '$paranoid'],
              topping_values: ['$all', '$paranoid']
            }],
            bill_ship_detail: ["$all"],
            paid_history: ["$all"]
          }]
        }
      })
      if (isPrint && data.items != null) {
        this.printBill(data, popupWin);
      }
    } catch (err) {
      this.alertItemNotFound()
      // alert(err);
    }
  }

  async printBill(data: any, popupWin: any) {

    console.log(data);

    let tableContent = "";
    let index = 0;
    data.items.forEach(item => {
      tableContent += "<tr class='small-text text-right'>";
      tableContent += '<td>' + (index++) + '</td>';
      tableContent += '<td>' + item.product.name + '</td>';
      tableContent += '<td>' + item.amount + '</td>';
      tableContent += '<td>' + this.addSpace(item.product_price) + '</td>';
      tableContent += '<td>' + this.addSpace(item.total_price) + '</td>';
      tableContent += '</tr>';
    });

    popupWin.document.write(`
            <html>
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">
                    <style>
                      @media print { body.receipt { width: 80mm, min-height: 500mm } }
                        .receipt { width: 80mm; min-height: 500mm; font-family: sans-serif; color: #555; text-align: center;  }
                        .sheet { padding: 2.5mm; }
                        .text-center { }
                        .text-left { text-align: left }
                        .text-right { text-align: right }
                        .brand-name { font-size: 2mm; }
                        .logo { width: 80%; margin: auto; }
                        .normal-text { margin-left: 0.5mm; font-size: 3.5mm;}
                        .small-text { font-size: 3mm; }
                        .title { font-size: 5mm; font-weight: 600; }
                        .padding-3 { padding: 3mm; }
                        .padding-4 { padding: 4mm; }
                        .left { float: left }
                        .right { float: right }
                        th { color: #444; border-bottom: dashed 1px;  }
                        td { color: #777 }
                        th, td { padding-top: 2mm; padding-bottom: 2mm; }
                    </style>
                </head>
                <body onload="window.print();window.close()" class="receipt">
                  <section class="sheet">
                    <img class='logo padding-3' src='` + this.brand.logo + `'>
                    <div class='text-center normal-text padding-3'>` + this.branch.address + `</div>
                    <div class='text-center normal-text'>Hotline: ` + this.branch.phone + `</div>

                    <hr style="border: none; border-top: solid 1px;" />

                    <div style="display: inline-block; width: 100%;">
                      <div class='small-text left'>Ngày đặt: ` + moment(data.created_at).format('L') + `</div>
                      <div class='small-text text-right right'>Ngày nhận: ` + moment().format('L') + `</div>
                    </div>

                    <div class='title padding-4'>Phiếu thanh toán</div>

                    <div class='normal-text text-left'>Mã đơn hàng: ` + this.formatBillCode(data.code) + `</div>
                    <div class='normal-text text-left'>Nhân viên giao hàng: Uy Minh</div>

                    <hr style="border: none; border-top: dashed 1px;" />
                    <table style="width:100%">
                      <tr class='small-text text-right'>
                        <th>TT</th>
                        <th>Tên sản phẩm</th>
                        <th>SL</th>
                        <th>Đơn giá</th>
                        <th>T. Tiền</th>
                      </tr>
                      ` + tableContent + `
                    </table>
                    <hr style="border: none; border-top: dashed 1px;" />
                    <div style="padding-bottom: 1.5mm; display: inline-block; width: 100%;">
                      <div class='small-text left'>Phí ship</div>
                      <div class='small-text right'>` + this.addSpace(data.bill_ship_detail.fee) + `</div>
                    </div>
                    <div style="padding-bottom: 1.5mm; display: inline-block; width: 100%;">
                      <div class='small-text left'>Phí VAT</div>
                      <div class='small-text right'>` + this.addSpace(data.vat_fee) + `</div>
                    </div>
                    <hr style="border: none; border-top: solid 1px;" />
                    <div style="margin: 3mm 0mm">
                      <div class='normal-text left'><b>Thành tiền</b></div>
                      <div class='normal-text right'><b>` + this.addSpace(data.total_price) + 'đ' + `</b></div>
                    </div>
                    <div style="min-height: 15mm">
                    </div>
                  </section>
                </body>
            </html>`
    );
    popupWin.document.close();
  }

  addSpace(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  async queryBill(query: string) {
    try {
      this.bills.next(await this.innowayApi.bill.getList({
        query: {
          fields: ["$all", {
            activities: ["$all", {
              employee: ["$all"]
            }],
            customer: ["$all"],
            activity: ["$all"],
            bill_ship_detail: ["$all"],
          }],
          order: [["updated_at", "desc"]]
        }
      }))
      console.log('bills', this.bills.getValue())
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadBillData() {
    try {
      this.bills.next(await this.innowayApi.bill.getList({
        local: false,
        query: {
          fields: ["$all", {
            activities: ["$all", {
              employee: ["$all"]
            }],
            customer: ["$all"],
            activity: ["$all"],
            bill_ship_detail: ["$all"],
            paid_history: ["$all"]
          }],
          filter: {
            created_at: {
              $gt: moment(Date.now()).format("YYYY-MM-DD"),
              $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
            }
          },
          order: [["updated_at", "desc"]]
        }
      }))
      this.ref.detectChanges();
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  viewDetail(bill) {
    this.router.navigate(['../bills/', bill.id], { relativeTo: this.route });
  }

  createBill() {
    this.router.navigate(['../../../pos/'], { relativeTo: this.route });
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

  // async changeStatusBill(bill) {
  //
  //   let actions = [];
  //   let options = this.globals.avaibleBillActivityOption(bill.activity ? bill.activity.action : '');
  //
  //   options.forEach(option => {
  //     actions.push({ code: Object.keys(option)[0], name: option[Object.keys(option)[0]] });
  //   });
  //
  //   console.log(bill);
  //   let currentAction = this.globals.detectBillActivityByCode(bill.activity.action);
  //   console.log(bill.activity.action)
  //
  //   let dialogRef = this.dialog.open(EditOrderStatusDialog, {
  //     width: '500px',
  //     data: { actions: actions, employees: this.employees, currentAction: currentAction }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.updateAction(bill, result.action, result.employee, result.note);
  //       // alert(JSON.stringify(result));
  //       console.log(result);
  //     }
  //   })
  // }
  //
  // async updateAction(bill, action, employee, note) {
  //   console.log("bambi: updateAction " + bill.id + " ---- " + action);
  //   try {
  //     // await this.billActitivyService.add({ bill_id, action });
  //     await this.innowayApi.bill.changeActivity(bill.id, {
  //       activity: action,
  //       employeeId: employee,
  //       note: note,
  //     })
  //     this.alertAddSuccess();
  //     this.bills.next([]);
  //     this.loadBillData();
  //   }
  //   catch (err) {
  //     console.log("bambi: " + err.toString());
  //     this.alertAddFailed();
  //   }
  // }

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
      let query = {
        fields: ["$all", {
          customer: ["$all"],
          activity: ["action"]
        }],
        filter: {
          "$activity.action$": action
        }
      }
      this.bills.next(await this.innowayApi.bill.getList({ query }))
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
      'font-style': this.someProperty ? 'italic' : 'normal',     // italic
      'font-weight': this.anotherProperty ? 'bold' : 'normal',  // normal
    };
    return styles;
  }

  editBill(data) {
    this.router.navigate(['../../bill/detail', data.id], { relativeTo: this.route });
  }

  formatBillCode(code): string {
    let output = "DH";
    for (let i of [0, 7 - code.length]) {
      output += "0";
    }
    output += code
    return output;
  }

  formatChannelStyle(data): string {
    return this.globals.detectChannelByCode(data);
  }

  formatBillActivityStyle(data): string {
    return this.globals.detectBillActivityByCode(data);
  }

  async showUpdatePaidHistoryDialog(bill) {

    let data = {
      title: "Cập nhật thông tin",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      total_amount: bill.paid_history ? bill.paid_history.remain_amount : 0,
      transaction_type: bill.paid_history ? bill.paid_history.transaction_status : null,
    };

    let dialogRef = this.dialog.open(UpdatePaidHistoryDialog, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        //alert(JSON.stringify(result));
        this.updatePaidHistory({
          bill_id: bill.id,
          receive_amount: result.receiveAmount,
          pay_amount: result.payAmount
        });
      }
    })
  }

  async updatePaidHistory(data) {
    try {
      console.log("updatePaidHistory request", JSON.stringify(data));
      let response = await this.innowayApi.paidHistory.updatePaidHistory(data);
      this.onLoadDailySummary(true);
      this.loadBillData();
      this.alertUpdateSuccess();
    } catch (err) {
      this.alertUpdateFailed();
      console.log("updatePaidHistory", JSON.stringify(err));
    }
  }

  detectPaidHistoryStatus(bill): boolean {
    if (bill.paid_history.transaction_status == this.globals.PAID_HISTORY_TYPES[1].code) {
      return false;
    }
    return true;
  }

  async loadEmployeeData() {
    try {
      this.employees = await this.innowayApi.employee.getList({
        query: {
          fields: ["$all"],
        },
      })
    } catch (err) {

    }
  }

  showEditInfoDialog(bill, employee, employees) {

    let data = {
      title: "Cập nhật thông tin",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      subFee: bill.sub_fee ? bill.sub_fee : 0,
      subFeeNote: bill.sub_fee_note ? bill.sub_fee_note : "",
      employee: employee,
      employees: employees,
      activity: bill.activity ? bill.activity.action : null,
    };

    let dialogRef = this.dialog.open(UpdateBillDataDialog, {
      width: '560px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.editBillInformation(bill, result);
      }
    })
  }

  async editBillInformation(bill, data: any) {
    try {
      switch (data.action) {
        case "updateBillStatus": {
          this.updateBillActivity(bill, {
            activity: data.billActivity,
            employeeId: data.employee,
            note: data.noteBillActivity,
          })
          break;
        }
        case "updateSubFee": {
          this.updateSubFee(bill, {
            price: this.globals.convertStringToPrice(data.subFee),
            description: data.subFeeNote,
          })
          break;
        }
        case "updateNote": {
          this.updateNoteBill(bill, {
            note: data.note
          })
          break;
        }
      }
    }
    catch (err) {
      this.alertUpdateFailed();
    }
  }

  async updateBillActivity(bill, data: any) {
    try {
      let response = await this.innowayApi.bill.changeActivity(bill.id, data)
      console.log("updateBillActivity", JSON.stringify(response))
      this.alertUpdateSuccess();
      this.onLoadDailySummary(true);
      this.loadBillData();
    } catch (err) {
      console.log("updateBillActivity",err);
      this.alertUpdateFailed();
    }
  }

  async updateSubFee(bill, data: any) {
    try {
      if (bill.sub_fees != null && bill.sub_fees.length > 0) {
        let response = await this.innowayApi.bill.updateSubFee(bill.id, bill.sub_fees[0].id, data);
        this.alertUpdateSuccess();
        this.onLoadDailySummary(true);
        this.loadBillData();
        console.log("updateSubFee", JSON.stringify(response));
      }
    } catch (err) {
      this.alertUpdateFailed();
    }
  }

  async updateNoteBill(bill, data: any) {
    try {
      let response = await this.innowayApi.bill.update(bill.id, data)
      console.log("updateBillActivity", JSON.stringify(response))
      this.alertUpdateSuccess();
      this.loadBillData();
    } catch (err) {
      this.alertUpdateFailed();
    }
  }
  detectBillActivityStatus(bill): boolean {
    if (bill.activity.action == "BILL_COLLECTED_MONEY"
      || bill.activity.action == "BILL_MODIFIED_AT_COLLECTED_MONEY") {
      return false;
    }
    return true;
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
