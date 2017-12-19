import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Globals } from '../../globals'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

@Component({
  selector: 'app-update-paid-history',
  providers: [Globals],
  templateUrl: './update-paid-history.component.html',
  styleUrls: ['./update-paid-history.component.scss']
})
export class UpdatePaidHistoryDialog implements OnInit {

  info = {};
  isValid: boolean = false;
  totalAmount: string = "0";
  payAmount: string = "0";
  amountAmount: string = "0";
  receiveAmount: string = "0";
  remainAmount: string = "0";
  transactionType: any = {
    name: "",
    code: ""
  };
  error: string;

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(
    public dialogRef: MatDialogRef<UpdatePaidHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ref: ChangeDetectorRef,
    private globals: Globals) { }

  ngOnInit() {
    console.log(this.data);
    this.totalAmount = this.data.total_amount;
    if (this.data.transaction_type != null) {
      this.transactionType.code = this.data.transaction_status;
      this.transactionType.name = this.globals.detectPaidHistoryTypeByCode(this.transactionType.code);
    }

    this.validateInputData();
  }

  validateInputData() {
    this.isValid = false;
    let remainAmount = 0;
    let totalAmount = this.globals.convertStringToPrice(this.totalAmount);
    let receiveAmount = this.globals.convertStringToPrice(this.receiveAmount);
    let payAmount = this.globals.convertStringToPrice(this.payAmount);

    this.error = null;

    if (receiveAmount == 0 || payAmount == 0) {
      this.error = "(Tiền nhập vào phải khác 0)";
    }

    if (receiveAmount < payAmount) {
      this.error = "(Tiền khách hàng gửi phải lớn hơn tiền phải trả)";
    }

    if (payAmount > totalAmount) {
      this.error = "(Tiền phải trả không được lớn hơn tiền còn thiếu)";
    }

    if (this.error == null) {
      this.isValid = true;
    }

    if (payAmount == totalAmount) {
      this.transactionType = this.globals.PAID_HISTORY_TYPES[1];
    } else {
      this.transactionType = this.globals.PAID_HISTORY_TYPES[0];
    }

    remainAmount = totalAmount - payAmount;
    this.remainAmount = remainAmount.toString();
    this.ref.detectChanges();
  }

  fillFullPayAmount() {
    this.receiveAmount = this.totalAmount;
    this.payAmount = this.totalAmount;
    this.validateInputData();
  }

  onYesClick() {
    this.info["totalAmount"] = this.globals.convertStringToPrice(this.totalAmount);
    this.info["receiveAmount"] = this.globals.convertStringToPrice(this.receiveAmount);
    this.info["payAmount"] = this.globals.convertStringToPrice(this.payAmount);
    this.info["remainAmount"] = this.globals.convertStringToPrice(this.remainAmount);
    this.info["transactionType"] = this.transactionType;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
