import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../globals";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
declare let swal:any

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
  account_type: string;
  active_code: string;
  avatar: string;
  birthday: string;
  email: string;
  fullname: string;
  password: string;
  phone: string;
  sex: number = 1;
  status: number = 1;

  customerType: string;
  customerTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  customerTypeService: any;
  customerService: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innoway: InnowayService) {
    this.customerService = innoway.getService('customer');
    this.customerTypeService = innoway.getService('customer_type');
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    await this.getCustomerTypeData();

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
    if (this.customerTypeData.getValue()[0]) {
      this.customerType = this.customerTypeData.getValue()[0].id;
    }
    return {
      status: this.status,
      customerType: this.customerType
    }
  }

  async setData() {
    try {
      let data = await this.customerService.get(this.id, {
        fields: ["$all"]
      });
      this.name = data.name
      this.account_type = data.account_type
      this.active_code = data.active_code
      this.avatar = data.avatar
      this.birthday = data.birthday
      this.email = data.email
      this.fullname = data.fullname
      this.password = data.password
      this.phone = data.phone
      this.sex = data.sex
      this.status = data.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      this.backToList()
    }
  }

  async getCustomerTypeData() {
    try {
      this.customerTypeData = await this.innoway.getAll('customer_type', {
        fields: ["id", "name"]
      });
    } catch (err) {
      console.error('Cannot load category', err);
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
    if (form.valid) {
      let { name, avatar, birthday, email, fullname, password, phone, sex, status } = this;
      await this.customerService.add({ name, avatar, birthday, email, fullname, password, phone, sex, status })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, avatar, birthday, email, fullname, password, phone, sex, status } = this;
      await this.customerService.update(this.id, { name, avatar, birthday, email, fullname, password, phone, sex, status })
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
