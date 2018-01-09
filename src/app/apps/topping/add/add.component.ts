import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef } from '@angular/core';

import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { AddPageInterface } from "../../interface/addPageInterface"
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayApiService } from 'app/services/innoway'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { Globals } from "../../../Globals"
import * as _ from 'lodash'
declare let swal: any

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  name: string;
  description: string;
  price: string;
  status: number = 1;
  topping_id: string;
  toppings: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globals: Globals,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService) {
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    await this.loadToppingData();

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
    this.price = "0";
    if (this.toppings.getValue()[0]) {
      this.topping_id = this.toppings.getValue()[0].id;
    }
    return {
      status: this.status,
      price: this.price,
      topping_id: this.topping_id
    }
  }

  async loadToppingData() {
    try {
      this.toppings.next(await this.innowayApi.topping.getList({
        query: { fields: ["id", "description", "name"] }
      }))
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.toppingValue.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      console.log("topping",JSON.stringify(data));
      this.name = data.name;
      if (data.topping_id == null) {
        data.topping_id = this.toppings.getValue()[0].id;
      }
      this.topping_id = data.topping_id ? data.topping_id : null;
      this.description = data.description;
      this.price = _.toString(data.price);
      this.status = data.status;
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
    }
  }

  backToListForAddNew() {
    this.router.navigate(['./../list'], { relativeTo: this.route });
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
    if (form.valid) {
      let { name, topping_id, description, price, status } = this;
      await this.innowayApi.toppingValue.add({ name, topping_id, description, price: this.globals.convertStringToPrice(price), status })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, topping_id, description, price, status } = this;
      await this.innowayApi.toppingValue.update(this.id, { name, topping_id, description, price: this.globals.convertStringToPrice(price), status })
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
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToListForAddNew();
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
