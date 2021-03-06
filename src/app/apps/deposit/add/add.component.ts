import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";

import { ColorPickerService } from 'ngx-color-picker';

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

  name: string;
  color: string = "#127bdc";
  logo: string;
  trail_expire: string;
  status: number = 1;

  pickerColor: string = "#127bdc";


  // Angular 2 Input Mask

  // Angular 2 Input Mask

 dateModel:string;
 dateMask:any = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];


  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private cpService: ColorPickerService,
    public innowayApi: InnowayApiService) {
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
    this.color = "#127bdc";
    return {
      status: this.status,
      color: this.color
    }
  }

  onChangeColorHex8(event) {
    this.color = event;
    this.ref.detectChanges();
  }

  async setData() {
    try {
      let data = await this.innowayApi.brand.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.name = data.name
      this.color = data.color
      this.logo = data.logo
      this.trail_expire = data.trail_expire
      this.status = data.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      // this.router.navigate(['unit'])
    }
  }

  backToList() {
    this.router.navigate(['/brand/list'])
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
      let { name, color, logo, trail_expire, status } = this;
      await this.innowayApi.brand.add({ name, color, logo, trail_expire, status })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, color, logo, trail_expire, status } = this;
      await this.innowayApi.brand.update(this.id, { name, color, logo, trail_expire, status })
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
