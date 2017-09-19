import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from 'app/services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router, ActivatedRoute } from "@angular/router";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
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

  promotionService: any;
  customerTypeService: any;
  promotionTypeService: any;

  name: string;
  amount: string;
  code: string;
  limit: string;
  description: string;
  start_date: string;
  end_date: string;
  value: string;
  customer_type_id: string;
  promotion_type_id: string;
  status: number = 1;
  customerTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  promotionTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.promotionService = innoway.getService('promotion');
    this.customerTypeService = innoway.getService('customer_type');
    this.promotionTypeService = innoway.getService('promotion_type');
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    await this.loadPromotionTypeData();
    await this.loadCustomerTypeData();

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
    this.start_date = null;
    this.end_date = null;
    this.value = null;
    this.limit = null;
    if (this.promotionTypeData.getValue()[0]) {
      this.promotion_type_id = this.promotionTypeData.getValue()[0].id;
    }
    if (this.customerTypeData.getValue()[0]) {
      this.customer_type_id = this.customerTypeData.getValue()[0].id;
    }
    return {
      status: this.status,
      promotion_type_id: this.promotion_type_id,
      customer_type_id: this.customer_type_id
    }
  }

  async setData() {
    try {
      let data = await this.promotionService.get(this.id, {
        fields: ["$all", {
          promotion_type: ["id", "name"], customer_type: ["id", "name"]
        }]
      });
      this.name = data.name
      this.amount = data.amount
      this.code = data.code
      this.limit = data.limit
      this.description = data.description
      this.start_date = data.start_date
      this.end_date = data.end_date
      this.value = data.value
      this.customer_type_id = data.customer_type_id
      this.promotion_type_id = data.promotion_type_id
      this.status = data.status

    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadPromotionTypeData() {
    try {
      this.promotionTypeData = await this.innoway.getAll('promotion_type', {
        fields: ["id", "name"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadCustomerTypeData() {
    try {
      this.customerTypeData = await this.innoway.getAll('customer_type', {
        fields: ["id", "name"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  backToList() {
    this.router.navigate(['../list'], { relativeTo: this.route });
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
      let { name, amount, code, limit, description, start_date, end_date, value, customer_type_id, promotion_type_id, status } = this;
      await this.promotionService.add({ name, amount, code, limit, description, start_date, end_date, value, customer_type_id, promotion_type_id, status })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, amount, code, limit, description, start_date, end_date, value, customer_type_id, promotion_type_id, status } = this;
      await this.promotionService.update(this.id, { name, amount, code, limit, description, start_date, end_date, value, customer_type_id, promotion_type_id, status })
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
