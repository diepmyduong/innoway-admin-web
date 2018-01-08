import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewContainerRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from 'app/services/innoway'
import { Globals } from './../../../globals';
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MatDialog } from '@angular/material';
import { EditInfoDialog } from "../../../modal/edit-info/edit-info.component";
import * as moment from 'moment';
import * as _ from 'lodash';
import { UpdatePaidHistoryDialog } from "../../../modal/update-paid-history/update-paid-history.component";
import { UpdateBillDataDialog } from "../../../modal/update-bill-data/update-bill-data.component";
import { SendMessageDialog } from "../../../modal/send-message/send-message.component";
import { SendStoryDialog } from "../../../modal/send-story/send-story.component";

declare let swal: any;

@Component({
  selector: 'app-detail',
  providers: [Globals],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  elRef: ElementRef;
  id: string;
  item: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  itemObject: any;
  itemFields: any = ['$all'];
  employee: any;
  employeeType: any;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";
  load_done: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isMember: boolean = true;

  branch: any;
  brand: any;
  bill: any = {};
  paidHistory: any[] = [];
  payAmount: number;
  isFullPayment: boolean = null;
  employees: any[];

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverNote: string;

  payerName: string;
  payerPhone: string;
  payerAddress: string;
  payerNote: string;

  isCancel: boolean = false;

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    elRef: ElementRef,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService,
    public dialog: MatDialog,
    private ngZone: NgZone
  ) {
    this.elRef = elRef;
    this.employee = this.innowayApi.innowayAuth.innowayUser
    console.log('employee', this.employee)
    console.log('innoway', this.innowayApi)
    this.setupUIFollowActor(this.employee);
  }

  private setupUIFollowActor(employee: any) {
    switch (employee.employee_type) {
      case this.globals.ACTORS[0].code: {//anonymous
        break;
      }
      case this.globals.ACTORS[1].code: {//customer
        break;
      }
      case this.globals.ACTORS[2].code: {//operator
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          sub_fees: ['$all'],
          activity: ['$all', {
            employee: ['$all']
          }],
          paid_history: ['$all'],
          paid_historys: ['$all', {
            employee: ['$all']
          }],
          related_people: ['$all']
        }];
        break;
      }
      case this.globals.ACTORS[3].code: {//shipper
        break;
      }
      case this.globals.ACTORS[4].code: {//checker
        break;
      }
      case this.globals.ACTORS[5].code: {//manager
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          sub_fees: ['$all'],
          activity: ['$all', {
            employee: ['$all']
          }],
          paid_history: ['$all'],
          paid_historys: ['$all', {
            employee: ['$all']
          }],
          related_people: ['$all']
        }];
        break;
      }
      case this.globals.ACTORS[6].code: {//admin
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          sub_fees: ['$all'],
          activity: ['$all', {
            employee: ['$all']
          }],
          paid_history: ['$all'],
          paid_historys: ['$all', {
            employee: ['$all']
          }],
          related_people: ['$all']
        }];
        break;
      }
      case this.globals.ACTORS[7].code: {//super_admin
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          sub_fees: ['$all'],
          activity: ['$all', {
            employee: ['$all']
          }],
          paid_history: ['$all'],
          paid_historys: ['$all', {
            employee: ['$all']
          }],
          related_people: ['$all']
        }];
        break;
      }
      default: {
        break;
      }
    }
  }

  async ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.setData()
      this.loadCurrentBrandData()
      this.loadCurrentBranchData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }

    this.loadBrandByEmployeeData(this.employee.brand_id);
    this.loadEmployeeData();
  }

  async loadCurrentBrandData() {
    try {
      if (this.employee.brand_id) {
        this.brand = await this.innowayApi.brand.getItem(this.employee.brand_id, {
          query: {
            fields: ["$all", {
              thirdparty_chatbot: ["$all"]
            }],
          }
        })
        this.ref.detectChanges();
      }
    } catch (err) {

    }
  }

  async loadCurrentBranchData() {
    try {
      if (this.employee.branch_id) {
        this.branch = await this.innowayApi.branch.getItem(this.employee.branch_id, {
          query: { fields: ["$all"] }
        })
        this.ref.detectChanges();
      }
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

  async setData() {
    try {

      this.item.next(await this.innowayApi.bill.getItem(this.id, {
        local: false,
        query: {
          fields: this.itemFields
        }
      }))

      this.bill = this.item.getValue();

      if (this.bill.customer) {
        if (this.bill.customer == null
          || this.bill.customer.phone == "000000"
          || this.bill.customer.fullname == "Khách Vãng Lai") {
          this.isMember = false;
        } else {
          this.isMember = true;
        }
      } else {
        this.isMember = false;
      }

      if (this.bill.paid_history != null && (this.bill.paid_history.transaction_type == this.globals.PAID_HISTORY_TYPES[1].code
        || this.bill.paid_history.remain_amount == 0)) {
        this.isFullPayment = true;
      } else {
        this.isFullPayment = false;
      }

      if (this.bill.paid_historys != null) {
        let payAmount = 0;
        this.bill.paid_historys.forEach((data, index) => {
          let total_pay_amount = data.pay_amount;
          for (let i = 0; i < index; i++) {
            total_pay_amount += this.bill.paid_historys[i].pay_amount;
          }
          data.total_remain = total_pay_amount;
          payAmount += data.pay_amount;
        })
        this.payAmount = payAmount;
      }

      if (this.bill.activity.action) {
        if (this.bill.activity.action.indexOf("CANCEL") >= 0
          || this.bill.activity.action.indexOf("DISTRIBUTED") >= 0) {
          this.isCancel = true
        } else {
          this.isCancel = false
        }
      }

      if (this.bill.related_people == null) {
        this.bill.related_people = {};
      }

      this.receiverName =
        this.bill.related_people.receiver_name ?
          this.bill.related_people.receiver_name : "không có";
      this.receiverPhone =
        this.bill.related_people.receiver_phone ?
          this.bill.related_people.receiver_phone : "không có";
      this.receiverAddress =
        this.bill.related_people.receiver_address ?
          this.bill.related_people.receiver_address : "không có";
      this.receiverNote =
        this.bill.related_people.receiver_note ?
          this.bill.related_people.receiver_note : "không có";

      this.payerName =
        this.bill.related_people.payer_name ?
          this.bill.related_people.payer_name : "không có";
      this.payerPhone =
        this.bill.related_people.payer_phone ?
          this.bill.related_people.payer_phone : "không có";
      this.payerAddress =
        this.bill.related_people.payer_address ?
          this.bill.related_people.payer_address : "không có";
      this.payerNote =
        this.bill.related_people.payer_note ?
          this.bill.related_people.payer_note : "không có";

      if (this.brand.thirdparty_chatbot) {
        if (this.bill.channel == "chatbot") {
          alert("chatbot");
        }
        if (this.bill.customer.chatbot_subscriber_id) {
          alert("chatbot");
        }
      }

      console.log("setData", JSON.stringify(this.bill));
      this.ref.detectChanges();
      this.load_done.next(true);
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem() {
    this.router.navigate(['../add', this.id], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật thất bại',
      type: 'warning',
      timer: 2000
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Cập nhật thành công',
      type: 'success',
      timer: 2000
    })
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

  changeDateFormat(time, format) {
    if (!time)
      return;

    if (format) {
      return moment(time).format(format);
    }
    return moment(time).format('L');
  }

  showEditInfoDialog(bill, employee, employees) {
    if (!this.load_done.getValue())
      return;

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
      if (response && this.brand.thirdparty_chatbot) {
        this.sendInvoiceToCustomer(bill);
      }
      this.alertUpdateSuccess();
      this.setData();
    } catch (err) {
      this.alertUpdateFailed();
    }
  }

  async updateSubFee(bill, data: any) {
    try {
      if (bill.sub_fees != null && bill.sub_fees.length > 0) {
        let response = await this.innowayApi.bill.updateSubFee(bill.id, bill.sub_fees[0].id, data);
        this.alertUpdateSuccess();
        this.setData();
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
      this.setData();
    } catch (err) {
      this.alertUpdateFailed();
    }
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

  async showUpdatePaidHistoryDialog(bill) {
    if (!this.load_done.getValue())
      return;

    let data = {
      title: "Cập nhật thông tin",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      total_amount: bill.paid_history ? bill.paid_history.remain_amount : 0,
      transaction_type: bill.paid_history ? bill.paid_history.transaction_status : null,
    };

    let dialogRef = this.dialog.open(UpdatePaidHistoryDialog, {
      width: '600px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        //alert(JSON.stringify(result));
        this.updatePaidHistory(bill, {
          bill_id: bill.id,
          receive_amount: result.receiveAmount,
          pay_amount: result.payAmount
        });
      }
    })
  }

  async updatePaidHistory(bill, data) {
    try {
      console.log("updatePaidHistory request", JSON.stringify(data));
      let response = await this.innowayApi.paidHistory.updatePaidHistory(data)
      this.setData();
      this.ref.detectChanges();
      this.alertUpdateSuccess();
    } catch (err) {
      this.alertUpdateFailed();
      console.log("updatePaidHistory", JSON.stringify(err));
    }
  }

  async print(bill) {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    this.printBill(bill, popupWin);
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

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  formatBillCode(code): string {
    let output = "DH";
    for (let i of [0, 7 - code.length]) {
      output += "0";
    }
    output += code
    return output;
  }

  openUpdateReceiverInfoDialog() {
    let data = {
      title: "Thông tin người nhận",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      inputs: [
        {
          title: "Họ và tên",
          property: "receiverName",
          type: "text",
          current: this.bill.related_people.recevier_name ? this.bill.related_people.recevier_name : "",
        },
        {
          title: "Số điện thoại",
          property: "receiverPhone",
          type: "number",
          current: this.bill.related_people.recevier_phone ? this.bill.related_people.recevier_phone : "",
        },
        {
          title: "Địa chỉ",
          property: "receiverAddress",
          type: "text",
          current: this.bill.related_people.recevier_address ? this.bill.related_people.recevier_address : "",
        },
        {
          title: "Ghi chú",
          property: "receiverNote",
          type: "text",
          current: this.bill.related_people.receiver_note ? this.bill.related_people.receiver_note : "",
        }
      ]
    };

    let dialogRef = this.dialog.open(EditInfoDialog, {
      width: '500px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.receiverName = result.receiverName ? result.receiverName : "";
        this.receiverPhone = result.receiverPhone ? result.receiverPhone : "";
        this.receiverAddress = result.receiverAddress ? result.receiverAddress : "";
        this.receiverNote = result.receiverNote ? result.receiverNote : "";

        this.updateRelatedPeopleOnBill({
          receiver_name: this.receiverName,
          receiver_address: this.receiverAddress,
          receiver_phone: this.receiverPhone,
          receiver_note: this.receiverNote
        })
      }
    })
  }

  openUpdatePayerInfoDialog() {
    let data = {
      title: "Thông tin người trả tiền",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      inputs: [
        {
          title: "Họ và tên",
          property: "payerName",
          type: "text",
          current: this.bill.related_people.payer_name ? this.bill.related_people.payer_name : "",
        },
        {
          title: "Số điện thoại",
          property: "payerPhone",
          type: "number",
          current: this.bill.related_people.payer_phone ? this.bill.related_people.payer_phone : "",
        },
        {
          title: "Địa chỉ",
          property: "payerAddress",
          type: "text",
          current: this.bill.related_people.payer_address ? this.bill.related_people.payer_address : "",
        },
        {
          title: "Ghi chú",
          property: "payerNote",
          type: "text",
          current: this.bill.related_people.payer_note ? this.bill.related_people.payer_note : "",
        }
      ]
    };

    let dialogRef = this.dialog.open(EditInfoDialog, {
      width: '500px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.payerName = result.payerName ? result.payerName : "";
        this.payerAddress = result.payerAddress ? result.payerAddress : "";
        this.payerPhone = result.payerPhone ? result.payerPhone : "";
        this.payerNote = result.payerNote ? result.payerNote : "";

        this.updateRelatedPeopleOnBill({
          payer_name: this.payerName,
          payer_address: this.payerAddress,
          payer_phone: this.payerPhone,
          payer_note: this.payerNote
        })
      }
    })
  }

  async updateRelatedPeopleOnBill(data) {
    try {
      await this.innowayApi.billRelatedPeople.update(this.bill.related_people.id, data)
      this.setData();
      this.alertUpdateSuccess();
    } catch (err) {
      this.alertUpdateFailed();
    }
  }

  showSendMessageDialog(input: any) {

    let data = {

    }

    let dialogRef = this.dialog.open(SendMessageDialog, {
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("response message", JSON.stringify(result))
      }
    })
  }

  showSendStoryDialog(input: any) {

    let data = {

    }

    let dialogRef = this.dialog.open(SendStoryDialog, {
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("response message", JSON.stringify(result))
      }
    })
  }

  async sendInvoiceToCustomer(bill: any) {
    try {
      let subscribers: string[] = [];
      subscribers.push(bill.customer.chatbot_subscriber_id)
      let params = {
        total_price: bill.total_price,
        vat_fee: bill.vat_fee,
        amount_of_sub_fee: bill.amount_of_sub_fee,
        amount_of_promotion: bill.amount_of_promotion,
        ship_fee: bill.ship_detail.ship_fee ? bill.ship_detail.ship_fee : 0,
        ship_method: bill.ship_detail.ship_method,
        created_at: bill.created_at,
        code: bill.code,
        address: bill.address,
        customer_fullname: bill.customer.fullname,
        greeting: "Chào {{first_name}} {{last_name}}, đơn hàng " + bill.code + " của quý khách đã được xác nhận thành công",
        send_by: "subscriber",
        subscribers: subscribers
      }
      let response = await this.innowayApi.thirdpartyChatbot.sendInvoiceToCustomer(params)
      console.log(JSON.stringify(response))
    } catch (err) {
      console.log(err)
    }
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
      this.setData()
      console.log(JSON.stringify(response));
    } catch (err) {
      this.alertDeleteFail()
      console.log(err)
    }
  }
}
