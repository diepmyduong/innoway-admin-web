import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Globals } from './../../../globals';
import { InnowayService, AuthService } from "app/services";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import createNumberMask from 'text-mask-addons/dist/createNumberMask'

declare var swal: any;

@Component({
  selector: 'app-paid',
  providers: [Globals],
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.scss']
})
export class PaidComponent implements OnInit {

  private id: string;
  private isEdit: boolean;
  private submitting: boolean = false;

  private PaidHistoryService: any;
  private transaction_time: string = "1";
  private total_amount: string = "10000000";
  private receive_amount: string = "0";
  private pay_amount: string = "0";
  private return_amount: string = "0";
  private remain_amount: string = "0";
  private employee_id: string;
  private bill_id: string;
  private type: string = "partical";
  private types: any[] = [];
  private employee: any;

  private numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private innoway: InnowayService,
    private auth: AuthService) {
    this.PaidHistoryService = innoway.getService('paid_history');
    this.employee = this.auth.service.userInfo;
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    await this.loadEmployeeData();

    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }
  }

  private calculateRemainAndReturnAmount(event) {
    let totalAmount = this.globals.convertStringToPrice(this.total_amount);
    let receiveAmount = this.globals.convertStringToPrice(this.receive_amount);
    let payAmount = this.globals.convertStringToPrice(this.pay_amount);
    this.remain_amount = (totalAmount - payAmount).toString();
    this.return_amount = (receiveAmount - payAmount).toString();
    if (totalAmount == payAmount) {
      this.type = this.globals.PAID_HISTORY_TYPES[1].name;
    } else {
      this.type = this.globals.PAID_HISTORY_TYPES[0].name;
    }
  }

  // private calculateReturnAmount(event) {
  //   let receiveAmount = this.globals.convertStringToPrice(this.receive_amount);
  //   let payAmount = this.globals.convertStringToPrice(this.pay_amount);
  //   this.return_amount = (receiveAmount - payAmount).toString();
  // }

  setDefaultData() {
    this.transaction_time = "1";
    this.total_amount = "10000000";
    this.receive_amount = "0";
    this.pay_amount = "0";
    this.return_amount = "0";
    this.remain_amount = "0";

    return {
      transaction_time: this.transaction_time,
      total_amount: this.total_amount,
      receive_amount: this.receive_amount,
      pay_amount: this.pay_amount,
      return_amount: this.return_amount,
      remain_amount: this.remain_amount,
    }
  }

  async setData() {
    try {
      // let bill = await this.billService.get(this.id, {
      //   fields: ["$all", {
      //     activities: ["$all"]
      //   }]
      // });
      // this.bill_actions = bill.activities;
      // let activity = bill.activities;
      // this.avaiable_actions = [];
      // this.actions.forEach(action => {
      //   if (action.action > activity[activity.length - 1].action) {
      //     let data = {
      //       action: action.action,
      //       name: action.name
      //     };
      //     this.avaiable_actions.push(data);
      //   }
      // });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
    }
  }

  async loadEmployeeData() {
    try {
      // this.employees = await this.innoway.getAll('employee', {
      //   fields: ["id", "fullname", "phone", "email"]
      // });
    } catch (err) {
      console.error("cannot load employees", err);
    }
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
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
      title: 'Đã thêm',
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

  async addItem(form: NgForm) {
    // if (form.valid) {
    //   let { name, description, image, status } = this;
    //   await this.billService.add({ name, description, image, status })
    //   this.alertAddSuccess();
    //   form.reset();
    //   form.resetForm(this.setDefaultData());
    // } else {
    //   this.alertFormNotValid();
    // }
  }

  async updateItem(form: NgForm) {
    // if (form.valid) {
    //   let { name, description, image, status } = this;
    //   await this.billService.update(this.id, { name, description, image, status })
    //   this.alertUpdateSuccess();
    //   form.reset();
    // } else {
    //   this.alertFormNotValid();
    // }
  }

  async submitAndNew(form: NgForm) {
    console.log('submit', form);
    this.submitting = true;
    try {
      await this.addItem(form);
    } catch (err) {
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToList();
    } catch (err) {
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.updateItem(form);
      this.backToList();
    } catch (err) {
      this.alertUpdateFailed();
    } finally {
      this.submitting = false;
    }
  }

  async addAction(form: NgForm) {
    if (form.valid && this.globals.convertStringToPrice(this.pay_amount) != 0) {
      let { transaction_time, total_amount, pay_amount, return_amount, remain_amount } = this;
      let employee_id = this.employee.id;
      let bill_id = this.id;
      await this.PaidHistoryService.add({ employee_id, bill_id, transaction_time, total_amount, pay_amount, return_amount, remain_amount })
      this.alertAddSuccess();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  checkAction(v): boolean {
    if (Number.parseInt(v.action) > 3) {
      return true;
    }
    return false;
  }

}
