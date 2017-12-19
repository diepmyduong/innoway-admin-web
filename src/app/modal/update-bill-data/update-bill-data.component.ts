import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Globals } from '../../globals'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

@Component({
  selector: 'app-update-bill-data',
  providers: [Globals],
  templateUrl: './update-bill-data.component.html',
  styleUrls: ['./update-bill-data.component.scss']
})
export class UpdateBillDataDialog implements OnInit {

  info = {};
  isValid: boolean;

  currentActivity: string;
  billActivity: string;
  billActivities: any[];
  subFee: string = "0";
  subFeeNote: string = "";
  employee: string;
  employees: any[];
  note: string;
  noteBillActivity: string;

  isShowEditInfo: boolean;

  error: string;

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(
    public dialogRef: MatDialogRef<UpdateBillDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ref: ChangeDetectorRef,
    private globals: Globals) { }

  ngOnInit() {
    console.log(this.data);

    this.subFee = this.data.subFee;
    this.subFeeNote = this.data.subFeeNote;
    this.employees = this.data.employees;
    this.employee = this.employees ? this.employees[0].id : null;
    this.currentActivity = this.data.activity ? this.data.activity : this.globals.BILL_ACTIVITIES[0].code;
    this.billActivities = [];
    this.note = this.data.note;

    let options = this.globals.avaibleBillActivityOption(this.currentActivity);

    options.forEach(option => {
      this.billActivities.push({ code: Object.keys(option)[0], name: option[Object.keys(option)[0]] });
    });

    this.billActivity = this.billActivities && this.billActivities.length > 0 ? this.billActivities[0].code : null;

    this.validateInputData();
  }

  validateInputData() {
    this.isValid = true;

    this.isShowEditInfo = true;
    switch (this.currentActivity) {
      case "BILL_CONFIRMED":
      case "BILL_MODIFIED_AT_BILL_CONFIRMED":
      case "BILL_CANCELLED_AT_BILL_CONFIRMED":
      case "BILL_PICKING_UP":
      case "BILL_MODIFIED_AT_PICKING_UP":
      case "BILL_CANCELLED_AT_PICKING_UP":
      case "BILL_RECEIVED":
      case "BILL_MODIFIED_AT_RECEIVED":
      case "BILL_CANCELLED_AT_RECEIVED":
      case "BILL_PROCESSING":
      case "BILL_MODIFIED_AT_PROCESSING":
      case "BILL_CANCELLED_AT_PROCESSING":
      case "BILL_PREPARED":
      case "BILL_MODIFIED_AT_PREPARED":
      case "BILL_CANCELLED_AT_PREPARED":
      case "BILL_SENT_SHIPPER":
      case "BILL_MODIFIED_AT_SENT_SHIPPER":
      case "BILL_CANCELLED_AT_SENT_SHIPPER":
      case "BILL_DELIVERING":
      case "BILL_MODIFIED_AT_DELIVERING":
      case "BILL_CANCELLED_AT_DELIVERING":
      case "BILL_PAID":
      case "BILL_MODIFIED_AT_PAID":
      case "BILL_COLLECTED_MONEY":
      case "BILL_MODIFIED_AT_COLLECTED_MONEY": {
        this.isShowEditInfo = false;
      }
    }

    this.ref.detectChanges();
  }

  confirmBillStatus(){
    this.info["action"]="updateBillStatus"
    this.info["billActivity"] = this.billActivity;
    this.info["employee"] = this.employee;
    this.info["noteBillActivity"] = this.noteBillActivity;
  }

  confirmSubFee(){
    this.info["action"]="updateSubFee"
    this.info["subFee"] = this.subFee;
    this.info["subFeeNote"] = this.subFeeNote;
  }

  confirmNote(){
    this.info["action"]="updateNote"
    this.info["note"] = this.note;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
