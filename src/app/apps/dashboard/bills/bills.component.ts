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
import { NotificationsService } from "angular2-notifications";
// import { MapsAPILoader } from "@agm/core";
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
    bill_ship_detail: ["fee"],
    sub_fees: ['$all'],
  }];

  subscribers: any = {}

  action: number = 1;

  processColor: string = "#3498db";
  successColor: string = "#2ecc71";
  cancelColor: string = "#e74c3c";

  options = {
    position: ["top", "right"],
    timeOut: 2000,
    lastOnBottom: true
  }

  billChangeObservable: BehaviorSubject<any> = new BehaviorSubject<any>({});
  bills: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  employees: any[];
  areas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  thumbDefault: string = "https://s11.favim.com/mini/160421/snowball-movie-the-secret-life-of-pets-cute-Favim.com-4234326.jpeg";
  actionSubscription: Subscription;
  selectedAction: string;
  selectedEmployee: any;
  selectedArea: number = 0;
  selectedCustomer: any;
  selectedBill: string;
  selectedCustomerName: any;
  currentDataFromFCM: any;

  employeeData: any;
  branch: any;
  brand: any;

  globalQuery: any;
  startTime: string;
  endTime: string;

  billFields: any = ["$all"]
  customerFields: any = ["$all"]
  activityFields: any = ["$all"]
  employeeFields: any = ["$all"]
  billShipDetailFields: any = ["$all"]
  paidHistoryFields: any = ["$all"]
  subFeeFields: any = ["$all"]
  billItemsFields: any = ["$all", {
    product: ["name"]
  }]
  billOrder: any = [["updated_at", "desc"]]
  customerFilter: any = null
  actitivyFilter: any = null
  billShipDetailFilter: any = null
  billFilter: any = null

  isShowSort: boolean = false
  numberOfResult: number = 0

  get billFilterInfo(): any {
    return this.sharedDataService.billFilterInfo;
  }
  set billFilterInfo(value: any) {
    this.sharedDataService.billFilterInfo = value;
  }

  constructor(
    private globals: Globals,
    private router: Router,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
    public zone: NgZone,
    // private mapsAPILoader: MapsAPILoader,
    public dialog: MatDialog,
    public sharedDataService: SharedDataService,
    private _notificationsService: NotificationsService
  ) {
    this.employeeData = this.innowayApi.innowayAuth.innowayUser
  }

  async ngOnInit() {
    moment.locale('vi')

    // this.loadBillData()
    this.customizeFilter()
    this.loadBranchByEmployeeData(this.employeeData.branch_id)
    this.loadBrandByEmployeeData(this.employeeData.brand_id)
    this.loadEmployeeData()
    // this.subscribeTopicByFCM()
    this.subscribeDashboardParent()
    // this.loadAuthCustomer()
  }

  async loadAuthCustomer() {
    try {
      let response = await this.innowayApi.authCustomer.getCustomerTokenByPhone({
        phone: "+84901403819"
      })

      console.log("loadAuthCustomer", JSON.stringify(response))

      // this.addAccountPrudential()
      this.getCustomerFromPrudential()

    } catch (err) {

    }
  }

  async addAccountPrudential() {
    try {
      let response = await this.innowayApi.customer.createAccount({
        username: "minhuy",
        password: "12345678",
        type: "GAD"
      })

      console.log("addAccountPrudential", JSON.stringify(response))

    } catch (err) {

    }
  }

  async getCustomerFromPrudential() {
    try {
      let response = await this.innowayApi.customer.getList({
        query: {
          fields: ["$all"],
          filter: {
            $or: [
              {
                account_type: {
                  $eq: 'GAD'
                }
              },
              {
                account_type: {
                  $eq: 'AGENT'
                }
              },
              {
                account_type: {
                  $eq: 'DEPARTMENT'
                }
              },
            ]
          }
        }
      })

      console.log("getCustomerFromPrudential", JSON.stringify(response))

      this.loginCustomerFromPrudential("minhuy", "12345678")

    } catch (err) {

    }
  }

  async loginCustomerFromPrudential(username: string, password: string) {
    try {
      let response = await this.innowayApi.authCustomer.customerPrudLogin({
        username: username,
        password: password
      })

      console.log("loginCustomerFromPrudential", JSON.stringify(response))
      this.getPaymentMethod(response.access_token)

    } catch (err) {

    }
  }

  async getPaymentMethod(accessToken: string) {
    try {
      let response = await this.innowayApi.customer.getPaymentMethodOfCustomer(accessToken)

      console.log("getPaymentMethod", JSON.stringify(response))

    } catch (err) {

    }
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
        if (data) {
          this.actitivyFilter = {
            $filter: {
              action: {
                $eq: data
              }
            }
          }
        } else {
          this.actitivyFilter = null
        }
        this.customizeFilter()
      });

    this.dashboardService.selectedEmployee.subscribe(
      data => {
        this.selectedEmployee = data;
        if (data) {
          this.actitivyFilter = {
            $filter: {
              employee_id: {
                $eq: data
              }
            }
          }
        } else {
          this.actitivyFilter = null
        }
        this.customizeFilter()
      });

    this.dashboardService.selectedArea.subscribe(
      data => {
        // this.selectedArea = data;
        // if (this.selectedArea != null) {
        //   this.customizeFilter()
        // }
      });

    this.dashboardService.selectedCustomer.subscribe(
      data => {
        this.selectedCustomer = data;
        if (data) {
          this.customerFilter = {
            $filter: {
              phone: {
                $like: `%${data}%`
              }
            }
          }
        } else {
          this.customerFilter = null
        }
        this.customizeFilter()
      });

    this.dashboardService.selectedCustomerName.subscribe(
      data => {
        this.selectedCustomerName = data;
        if (data) {
          this.customerFilter = {
            $filter: {
              fullname: {
                $iLike: `%${data}%`
              }
            }
          }
        } else {
          this.customerFilter = null
        }
        this.customizeFilter()
      });

    this.dashboardService.selectedBill.subscribe(
      data => {
        this.selectedBill = data;
        if (data) {
          this.billFilter = {
            code: {
              $eq: Number.parseInt(data)
            },
            created_at: {
              $gt: moment(Date.now()).format("YYYY-MM-DD"),
              $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
            }
          }
        } else {
          this.billFilter = {
            created_at: {
              $gt: moment(Date.now()).format("YYYY-MM-DD"),
              $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
            }
          }
        }
        this.customizeFilter()
      });
  }

  async advanceFilter(type: string, input: any) {
    let codeNumber = Number.parseInt(input.content)
    let query: any;
    switch (type) {
      case "bill": {
        query = {
          fields: ["$all", {
            activities: ["$all", {
              employee: ["$all"]
            }],
            customer: ["$all"],
            activity: ["$all"],
            bill_ship_detail: ["$all"],
            paid_history: ["$all"],
            sub_fees: ['$all'],
          }],
          filter: {
            code: {
              $eq: Number.parseInt(input.data)
            },
            created_at: {
              $gt: moment(Date.now()).format("YYYY-MM-DD"),
              $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
            }
          },
          order: [["updated_at", "desc"]]
        }
        break;
      }
      case "customer-phone": {
        query = {
          fields: ["$all", {
            activities: ["$all", {
              employee: ["$all"]
            }],
            customer: ["$all", {
              $filter: {
                phone: {
                  $iLike: `%${input.data}%`
                }
              }
            }],
            activity: ["$all"],
            bill_ship_detail: ["$all"],
            paid_history: ["$all"],
            sub_fees: ['$all'],
          }],
          filter: {
            created_at: {
              $gt: moment(Date.now()).format("YYYY-MM-DD"),
              $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
            }
          },
          order: [["updated_at", "desc"]]
        }
        break;
      }
      case "customer-name": {
        query = {
          fields: ["$all", {
            activities: ["$all", {
              employee: ["$all"]
            }],
            customer: ["$all", {
              $filter: {
                name: {
                  $iLike: `%${input.data}%`
                }
              }
            }],
            activity: ["$all"],
            bill_ship_detail: ["$all"],
            paid_history: ["$all"],
            sub_fees: ['$all'],
          }],
          filter: {
            created_at: {
              $gt: moment(Date.now()).format("YYYY-MM-DD"),
              $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
            }
          },
          order: [["updated_at", "desc"]]
        }
        break;
      }
      default: {
        query = {
          fields: ["$all", {
            activities: ["$all", {
              employee: ["$all"]
            }],
            customer: ["$all"],
            activity: ["$all"],
            bill_ship_detail: ["$all"],
            paid_history: ["$all"],
            sub_fees: ['$all'],
          }],
          filter: {
            created_at: {
              $gt: moment(Date.now()).format("YYYY-MM-DD"),
              $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
            }
          },
          order: [["updated_at", "desc"]]
        }
      }
    }

    try {
      console.log("changeOptions", JSON.stringify(query))
      this.zone.run(async () => {
        const bills = await this.innowayApi.bill.getList({
          local: false,
          query: query
        })
        console.log('bills', bills)
        this.bills.next(bills)
        console.log('local bill', this.bills.getValue())
        console.log('filter', this.billFilterInfo)
      })
    }
    catch (err) {
      console.log("changeOptions", err)
    }
  }

  async subscribeTopicByFCM() {
    // this.dashboardService.updateTopicFromFCM.subscribe(
    //   data => {
    //     this.currentDataFromFCM = data;
    //     console.log("subscribeTopicFromFCM", data)
    //     if (this.currentDataFromFCM != null) {
    //       this.loadBillData();
    //       this.onLoadDailySummary(true);
    //     }
    //   });
  }

  async ngOnDestroy() {
    console.log('on destroy')
    _.forEach(this.subscribers, (subscription: Subscription) => {
      subscription.unsubscribe()
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
            paid_history: ["$all"],
            sub_fees: ['$all'],
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
      this.onLoadDailySummary(true)
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
      //this.loadBillData();
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
      branch: this.branch
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
            type: data.thirdparty,
            total_weight: data.total_weight,
            address: data.address,
            longitude: data.longitude,
            latitude: data.latitude,
            note_code: data.note_code
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
      let request = data;
      switch (data.type) {
        case 'UBER_DELIVER':
          request = {
            activity: data.activity,
            employeeId: data.employeeId,
            note: data.note,
            type: data.type,
            data: {
              pick_address: {
                longitude: Number.parseFloat(data.longitude),
                latitude: Number.parseFloat(data.latitude)
              },
              receive_address: {
                longitude: Number.parseFloat(bill.longitude),
                latitude: Number.parseFloat(bill.latitude)
              },
              user: {
                token: "KA.eyJ2ZXJzaW9uIjoyLCJpZCI6IjJPN3pOZXpaVDQrV1JObnY5VWRNSHc9PSIsImV4cGlyZXNfYXQiOjE1MjMxNjExNzksInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.G49W4OGyOoxJC0iKcUHf1uoFw2G9kvEC2i509kdWKfM"
              }
            }
          }
          break
        case 'GHN':
          request = {
            activity: data.activity,
            employeeId: data.employeeId,
            note: data.note,
            type: data.type,
            data: {
              pick_address: {
                longitude: Number.parseFloat(data.longitude),
                latitude: Number.parseFloat(data.latitude)
              },
              receive_address: {
                longitude: Number.parseFloat(bill.longitude),
                latitude: Number.parseFloat(bill.latitude)
              },
              total_weight: Number.parseFloat(data.total_weight),
              note_code: data.note_code
            },
          }
          break
        case 'GHTK':
          request = {
            activity: data.activity,
            employeeId: data.employeeId,
            note: data.note,
            type: data.type,
            products: [],
            order: {
              id: bill.uuid,
              pick_name: "HCM-nội thành",
              pick_address: "590 CMT8 P.11",
              pick_province: "TP. Hồ Chí Minh",
              pick_district: "Quận 3",
              pick_tel: "0942654141",
              tel: "0901403819",
              name: "GHTK - HCM - Noi Thanh",
              address: "123 nguyễn chí thanh",
              province: "TP. Hồ Chí Minh",
              district: "Quận 1",
              pick_date: "2018-03-15",
              pick_money: bill.total_price
            }
          }

          bill.items.forEach(item => {
            request.products.push({
              name: item.product.name,
              weight: 0.2
            })
          })
          break
        case 'MCOM':
        default:
          request = {
            activity: data.activity,
            employeeId: data.employeeId,
            note: data.note,
            type: 'MCOM',
            end_latitude: bill.latitude,
            end_longitude: bill.longitude
          }
          break;
      }
      console.log("Info request", JSON.stringify(request))

      let response = await this.innowayApi.bill.changeActivity(bill.id, request)

      console.log("Info response", JSON.stringify(response))

      this.alertUpdateSuccess();
      this.refreshBill();
    } catch (err) {
      console.log("updateBillActivity", err);
      this.alertUpdateFailed();
    }
  }

  async updateSubFee(bill, data: any) {
    try {
      if (bill.sub_fees != null && bill.sub_fees.length > 0) {
        let response = await this.innowayApi.bill.updateSubFee(bill.id, bill.sub_fees[0].id, data);
        this.alertUpdateSuccess();
        //this.loadBillData();
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
      //this.loadBillData();
    } catch (err) {
      this.alertUpdateFailed();
    }
  }
  detectBillActivityStatus(bill): boolean {
    if (bill.activity.action == "BILL_COLLECTED_MONEY"
      || bill.activity.action == "BILL_MODIFIED_AT_COLLECTED_MONEY"
      || bill.activity.action.indexOf("CANCEL") >= 0) {
      return false;
    }
    return true;
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  showCancelBillDialog(bill: any) {
    swal({
      title: 'Bạn muốn hủy đơn hàng?',
      text: 'Đơn hàng sẽ chuyển sang trạng thái hủy.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy đơn hàng',
      cancelButtonText: 'Bỏ qua'
    }).then((result) => {
      console.log(result)
      if (result) {
        this.cancelBill(bill)
        // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      } else if (result.dismiss === 'cancel') {

      }
    })
  }

  async cancelBill(bill: any) {
    try {
      let request = {
        billId: bill.id
      }
      let response = await this.innowayApi.bill.cancel(request);
      this.alertDeleteSuccess()
      this.loadBillData()
      console.log(JSON.stringify(response));
    } catch (err) {
      this.alertDeleteFail()
      console.log(err)
    }
  }

  detectShowCancelButton(bill): boolean {
    if (bill.activity.action) {
      if (bill.activity.action.indexOf("CANCEL") >= 0
        || bill.activity.action.indexOf("DISTRIBUTED") >= 0
        || bill.activity.action.indexOf("PAID") >= 0
        || bill.activity.action.indexOf("COLLECTED_MONEY") >= 0) {
        return true
      }
    }
    return false
  }

  alertDeleteSuccess() {
    return swal({
      title: 'Hủy đơn hàng thành công',
      type: 'success',
      timer: 2000
    })
  }

  alertDeleteFail() {
    return swal({
      title: 'Hủy đơn hàng thất bại',
      type: 'warning',
      timer: 2000
    })
  }

  showNotification(title: string, content: string) {
    this._notificationsService.success(
      title,
      content,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    );
  }

  billType: number

  async changeOptions(type: string) {
    console.log("changeOptions", type)
    this.billShipDetailFilter = null
    let query: any;
    switch (type) {
      case "1": {
        console.log("changeOptions - 1", type)
        this.billFilter = {
          created_at: {
            $gt: moment(Date.now()).format("YYYY-MM-DD"),
            $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
          }
        }

        this.billShipDetailFilter = null

        break;
      }
      case "2": {
        console.log("changeOptions - 2", type)
        this.billFilter = {
          created_at: {
            $gt: moment(Date.now()).subtract(30, 'days').format("YYYY-MM-DD"),
            $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
          }
        }

        this.billShipDetailFilter =
          {
            $filter: {
              received_time: {
                $gt: moment().format("YYYY-MM-DD"),
                $lt: moment().add(1, 'days').format("YYYY-MM-DD")
              }
            }
          }


        break;
      }
      case "3": {
        console.log("changeOptions - 3", type)
        this.billFilter = {
          created_at: {
            $gt: moment(Date.now()).subtract(30, 'days').format("YYYY-MM-DD"),
            $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
          }
        }

        this.billShipDetailFilter = null

        break;
      }
      default: {

        console.log("changeOptions - default", type)
        this.billFilter = {
          created_at: {
            $gt: moment(Date.now()).format("YYYY-MM-DD"),
            $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
          }
        }

        this.billShipDetailFilter = null

        break;
      }
    }


    try {
      this.customizeFilter()
    }
    catch (err) {
      console.log("changeOptions", err)
    }
  }

  async customizeFilter() {

    let billFields = this.billFields
    let customerFields = this.customerFields
    let activityFields = this.activityFields
    let employeeFields = this.employeeFields
    let billShipDetailFields = this.billShipDetailFields
    let paidHistoryFields = this.paidHistoryFields
    let subFeeFields = this.subFeeFields
    let billItemsFields = this.billItemsFields
    let billOrder = this.billOrder
    let customerFilter = this.customerFilter
    let actitivyFilter = this.actitivyFilter
    let billShipDetailFilter = this.billShipDetailFilter
    let billFilter = this.billFilter

    if (!billFilter) {
      billFilter = {
        created_at: {
          $gt: moment(Date.now()).format("YYYY-MM-DD"),
          $lt: moment(Date.now()).add(1, 'days').format("YYYY-MM-DD")
        }
      }
    }

    customerFields = ["$all"]
    if (customerFilter) {
      customerFields.push(customerFilter)
    }

    activityFields = ["$all"]
    if (actitivyFilter) {
      activityFields.push(actitivyFilter)
    }

    billShipDetailFields = ["$all"]
    if (billShipDetailFilter) {
      billShipDetailFields.push(billShipDetailFilter)
    };

    let query = {
      fields: ["$all", {
        customer: customerFields,
        activity: activityFields,
        items: billItemsFields,
        bill_ship_detail: billShipDetailFields,
        paid_history: paidHistoryFields,
        sub_fees: subFeeFields,
      }],
      filter: billFilter,
      order: billOrder,
      limit: 0
    }

    try {
      this.bills.next(await this.innowayApi.bill.getList({
        local: false,
        query: query
      }))
      if (this.bills.getValue()) {
        this.numberOfResult = this.bills.getValue().length
      } else {
        this.numberOfResult = 0
      }
      this.ref.detectChanges()
    }
    catch (err) {
      console.log("customizeFilter", err)
    }
  }

  showOrHideSort() {
    this.isShowSort = !this.isShowSort
  }

  refreshBill() {
    this.customizeFilter()
  }

  convertTime(date) {
    return moment(date).format("HH:mm")
  }
}
