import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { PageService } from "app/chatbot/services/page.service";
import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { AddPageInterface } from "../../interface/addPageInterface"
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from '../../services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
  toppingService: any;
  toppingValueService: any;
  name: string;
  description: string;
  price: string;
  status: number = 1;
  topping_id: string;
  toppings: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  toppingDefault: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.toppingService = innoway.getService('topping');
    this.toppingValueService = innoway.getService('topping_value');
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

    this.loadToppingData();
  }

  setDefaultData() {
    this.status = 1;
  }

  async loadToppingData() {
    try {
      let data = await this.innoway.getAll('topping', {
        fields: ["id", "name"]
      });
      this.toppings = data._value;
      this.topping_id = this.toppings[0].name;
      // this.topping_id.value=this.toppings[0].name;
      this.ref.detectChanges();
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.router.navigate(['topping'])
    }
  }

  async setData() {
    try {
      let data = await this.toppingValueService.get(this.id, {
        fields: ["name", "topping_id", "description", "price", "status"]
      });
      this.name = data.name;
      this.topping_id = data.topping;
      this.description = data.description;
      this.price = data.price;
      this.status = data.status;
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.router.navigate(['topping'])
    }
  }

  backToList() {
    this.router.navigate(['/topping/list'])
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
      await this.toppingValueService.add({ name, topping_id, description, price, status })
      this.alertAddSuccess();
      form.reset();
      form.controls["status"].setValue(1);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, topping_id, description, price, status } = this;
      await this.toppingValueService.update(this.id, { name, topping_id, description, price, status })
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
