import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../globals";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
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
  avatar: string;
  birthday: string;
  email: string;
  fullname: string;
  password: string;
  phone: string;
  sex: string = null;
  genders: any;
  status: number = 1;
  trustPoint: number = 3;

  isExisted: boolean = false;
  isValidPhone: boolean = false;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  customerService: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innoway: InnowayService) {
    this.customerService = innoway.getService('customer');
    this.genders = this.globals.GENDERS;
  }

  async ngOnInit() {
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
    this.trustPoint = 3;
    this.sex = "0";

    return {
      status: this.status,
      trustPoint: this.trustPoint,
      sex: this.sex
    }
  }

  async setData() {
    try {
      let data = await this.customerService.get(this.id, {
        fields: ["$all"]
      });
      this.avatar = data.avatar
      this.birthday = data.birthday
      this.email = data.email
      this.fullname = data.fullname
      this.password = data.password
      this.phone = data.phone
      this.sex = data.sex ? data.sex.toString() : null
      this.status = data.status
      this.trustPoint = data.trust_point ? data.trust_point : 3
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
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
    if (form.valid && !this.isExisted && this.isValidPhone) {
      let { name, avatar, email, fullname, password, phone, sex, status } = this;
      let trust_point = this.trustPoint;
      let birthday = null;
      if (!this.birthday) {
        birthday = new Date(this.birthday);
      }
      await this.customerService.add({ name, avatar, birthday, email, fullname, password, phone, sex, status, trust_point })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid && !this.isExisted && this.isValidPhone) {
      let { name, avatar, email, fullname, password, phone, sex, status } = this;
      let trust_point = this.trustPoint;
      let birthday = null;
      if (!this.birthday) {
        birthday = new Date(this.birthday);
      }
      await this.customerService.update(this.id, { name, avatar, birthday, email, fullname, password, phone, sex, status, trust_point })
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

  async validateCustomerByPhone(phone: string) {
    try {
      let data = {
        phone: phone.toString()
      }
      let response = await this.customerService.getCustomerByPhone(data);

      if (response != null && response.code != 500) {
        console.log(JSON.stringify(response));
        this.isExisted = true;
      } else {
        this.isExisted = false;
      }
    } catch (err) {
      this.isExisted = false;
    }
  }

  onBlurMethodPhone(event) {
    if (event.isTrusted) {
      if (this.phone.indexOf("+84") == -1) {
        let data = this.globals.convertStringToFormatPhone(this.phone);
        this.phone = data.phone;
        this.isValidPhone = data.isValid;
        this.validateCustomerByPhone(this.phone);
      }
    }
  }
}
