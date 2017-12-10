import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayService } from 'app/services';

declare let swal: any
import * as Ajv from 'ajv';
import * as moment from 'moment';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { Globals } from "./../../../globals";

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;
  customerTypeService: any;

  name: string;
  description: string;
  lastDateOrder: string = null;
  numberOfBill: string = "0";
  amountOfPurchase: string = "0";
  sex: string = null;
  status: number = 1;

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', '2', '0', '1', '7', ' ', /\d/, /\d/, ':', /\d/, /\d/];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globals: Globals,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService
  ) {
    this.customerTypeService = innoway.getService('customer_type');
    //this.lastDateOrder = moment(Date.now()).format('MM/DD/yyyy hh:mm');
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
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

  setDefaultData() {
    this.status = 1;
    this.lastDateOrder = null;
    this.numberOfBill = "0";
    this.amountOfPurchase = "0";
    this.sex = null;
    return {
      status: this.status,
      lastDateOrder: this.lastDateOrder,
      numberOfBill: this.numberOfBill,
      amountOfPurchase: this.amountOfPurchase,
      sex: this.sex
    }
  }

  async setData() {
    try {
      let data = await this.customerTypeService.get(this.id, {
        fields: ["$all"]
      });

      this.name = data.name
      this.description = data.description
      this.lastDateOrder = data.last_date_order.toString()
      this.numberOfBill = data.number_of_bill.toString()
      this.amountOfPurchase = data.amount_of_purchase.toString()
      this.sex = data.sex.toString()
      this.status = data.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
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
    if (form.valid && this.lastDateOrder.toString().toLowerCase().indexOf("invalid") == -1) {
      let { lastDateOrder, numberOfBill, amountOfPurchase, sex, name, description, status } = this;
      let last_date_order = new Date(lastDateOrder);
      let number_of_bill = numberOfBill;
      let amount_of_purchase = this.globals.convertStringToPrice(amountOfPurchase);
      await this.customerTypeService.add({ last_date_order, number_of_bill, amount_of_purchase, sex, name, description, status })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid && this.lastDateOrder.toString().toLowerCase().indexOf("invalid") == -1) {
      let { lastDateOrder, numberOfBill, amountOfPurchase, sex, name, description, status } = this;
      let last_date_order = new Date(lastDateOrder);
      let number_of_bill = numberOfBill;
      let amount_of_purchase = this.globals.convertStringToPrice(amountOfPurchase);
      await this.customerTypeService.update(this.id, { last_date_order, number_of_bill, amount_of_purchase, sex, name, description, status })
      this.alertUpdateSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
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
}
