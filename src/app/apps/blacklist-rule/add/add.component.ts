import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
import { NgForm } from "@angular/forms";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

declare let swal:any

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  promotionService: any;
  customerTypeService: any;
  promotionTypeService: any;

  name: string;
  amount: string;
  code: string;
  customer_type_id: number = 1;
  customer_types = new BehaviorSubject<any[]>([]);
  description: string;
  end_date: string;
  start_date: string;
  limit: string;
  promotion_type_id: number = 1;
  promotion_types = new BehaviorSubject<any[]>([]);
  value: string;
  status: number = 1;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.promotionService = innoway.getService('promotion');
    this.promotionTypeService = innoway.getService('promotion_type');
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
  }

  async setData() {
    try {
      let data = await this.promotionService.get(this.id, {
        fields: ["$all"]
      });
      this.name = data.name
      this.amount = data.amount
      this.code = data.code
      this.customer_type_id = data.customer_type_id
      this.description = data.description
      this.end_date = data.end_date
      this.start_date = data.start_date
      this.limit = data.limit
      this.promotion_type_id = data.promotion_type_id
      this.value = data.value
      this.status = data.status

    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      // this.router.navigate(['unit'])
    }
  }

  async loadPromotionTypeData(){

  }

  async loadCustomerTypeData(){

  }

  backToList() {
    this.router.navigate(['/promotion/list'])
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
      let { name, amount, code, customer_type_id, description, end_date, start_date, limit, promotion_type_id, value, status } = this;
      await this.promotionService.add({ name, amount, code, customer_type_id, description, end_date, start_date, limit, promotion_type_id, value, status })
      this.alertAddSuccess();
      form.reset();
      form.controls["status"].setValue(1);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, amount, code, customer_type_id, description, end_date, start_date, limit, promotion_type_id, value, status } = this;
      await this.promotionService.update(this.id, { name, amount, code, customer_type_id, description, end_date, start_date, limit, promotion_type_id, value, status })
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
