import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
import { NgForm } from "@angular/forms";

declare var swal: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  customerTypeService: any;

  name: string;
  amount_of_purchase: string;
  last_date_order: string;
  number_of_bill: string;
  sex: number = 1;
  status: number = 1;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.customerTypeService = innoway.getService('customer_type');
  }

  ngOnInit(): void {
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
    return {
      status: this.status
    }
  }

  async setData() {
    try {
      let data = await this.customerTypeService.get(this.id, {
        fields: ["$all"]
      });
      this.name = data.name
      this.amount_of_purchase = data.amount_of_purchase
      this.number_of_bill = data.number_of_bill
      this.last_date_order = data.last_date_order
      this.sex = data.sex
      this.status = data.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  backToList() {
    this.router.navigate(['/customer-type/list'])
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
    if (form.valid) {
      let { name, amount_of_purchase, number_of_bill, last_date_order, sex, status } = this;
      await this.customerTypeService.add({ name, amount_of_purchase, number_of_bill, last_date_order, sex, status })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, amount_of_purchase, number_of_bill, last_date_order, sex, status } = this;
      await this.customerTypeService.update(this.id, { name, amount_of_purchase, number_of_bill, last_date_order, sex, status })
      this.alertUpdateSuccess();
      form.reset();
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
      console.log("ERROR SUBMIT", err);
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
