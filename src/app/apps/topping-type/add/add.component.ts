import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { AddPageInterface } from "../../interface/addPageInterface"
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { Globals } from "../../../Globals"
import { InnowayApiService } from 'app/services/innoway'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
declare let swal: any

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  providers: [Globals],
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  name: string;
  description: string;
  isSelectMultiple: boolean = true;
  status: number = 1;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
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
    return {
      status: this.status
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.topping.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.name = data.name
      this.description = data.description
      this.isSelectMultiple = data.is_select_multiple
      this.status = data.status
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
      let { name, description, isSelectMultiple, status } = this;
      let is_select_multiple = isSelectMultiple
      await this.innowayApi.topping.add({ name, description, is_select_multiple, status })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, description, isSelectMultiple, status } = this;
      let is_select_multiple = isSelectMultiple
      await this.innowayApi.topping.update(this.id, { name, description, is_select_multiple, status })
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

  checkSelectMultiple(event) {
    this.isSelectMultiple = event;
  }
}
