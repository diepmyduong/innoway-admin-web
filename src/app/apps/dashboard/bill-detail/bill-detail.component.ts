import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InnowayApiService } from "app/services/innoway";
import * as moment from 'moment';

import { Globals } from './../../../globals';
import { UpdateBillDataDialog } from "../../../modal/update-bill-data/update-bill-data.component";
import { MatDialog } from "@angular/material";
import { UpdatePaidHistoryDialog } from "app/modal/update-paid-history/update-paid-history.component";
declare let swal: any

@Component({
  selector: 'app-bill-detail',
  providers: [Globals],
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailComponent implements OnInit {

  id: string;
  item: any = {};
  employee: any;
  employees: any[];
  brand: any;
  branch: any;
  bill: any;

  itemFields: any = ['$all', {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService,
    private globals: Globals,
    public dialog: MatDialog,
  ) {
    this.employee = this.innowayApi.innowayAuth.innowayUser
  }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    console.log('bill detail', this.id)
    if (this.id) {
      this.setData()
      this.loadEmployeesData()
      this.loadCurrentBrandData()
      this.loadCurrentBranchData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async setData() {
    try {
      this.item = await this.innowayApi.bill.getItem(this.id, {
        local: false,
        query: { fields: this.itemFields }
      })
      console.log("billdata:" + JSON.stringify(this.item));
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  backToList() {
    this.router.navigate(['./bills'], { relativeTo: this.route.parent });
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

  viewLocationBillDetail() {
    this.router.navigate(['./bill-location/', this.id], { relativeTo: this.route.parent });
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

  async loadEmployeesData() {
    try {
      this.employees = await this.innowayApi.employee.getList(
        {
          query: {
            fields: ["$all"]
          }
        }
      );

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

  detectBillActivityStatus(bill): boolean {
    if (bill == null) {
      return false;
    }
    if (bill.activity != null) {
      if (bill.activity.action == "BILL_COLLECTED_MONEY"
        || bill.activity.action == "BILL_MODIFIED_AT_COLLECTED_MONEY") {
        return false;
      }
      return true;
    }
    else {
      return false;
    }
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
      this.setData();
      this.alertUpdateSuccess();
    } catch (err) {
      this.alertUpdateFailed();
      console.log("updatePaidHistory", JSON.stringify(err));
    }
  }

  detectPaidHistoryStatus(bill): boolean {
    if (bill && bill.paid_history) {
      if (bill.paid_history.transaction_status == this.globals.PAID_HISTORY_TYPES[1].code) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  viewDetail(bill) {
    this.router.navigate(['../../../bill/detail', bill.id], { relativeTo: this.route });
  }

  async print(bill) {

    if (bill == null) {
      return;
    }

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

  async loadCurrentBrandData() {
    try {
      if (this.employee.brand_id) {
        this.brand = await this.innowayApi.brand.getItem(this.employee.brand_id, {
          query: { fields: ["$all"] }
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
}
