import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from 'app/services/innoway';
import * as moment from 'moment';

declare let swal: any

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;

  brands: any[];
  brandId: string;
  buyer: string;
  agent: string;
  description: string;
  duration: number = 0;
  isActive: boolean = true;
  startTime: string;
  endTime: string;
  status: number

  @ViewChild("fileUploader")
  fileUploader: ElementRef;

  progress: boolean | number = false;

  isUploadImage: boolean = false;
  fileUpload: File;
  previewImage: string;
  closeImage: string = "https://d30y9cdsu7xlg0.cloudfront.net/png/55049-200.png";
  errorImage: string = "http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService
  ) {
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

  // brandId: string;
  // buyer: string;
  // agent: string;
  // description: string;
  // duration: number = 0;
  // isActive: boolean = true;
  // startTime: Date;
  // endTime: Date;
  // status: number

  setDefaultData() {
    this.brandId = null;
    this.buyer = null;
    this.agent = null;
    this.description = null;
    this.duration = 0
    this.isActive = true
    this.startTime = moment(Date.now()).format()
    this.endTime = moment(Date.now()).add(30, 'days').format()
    this.status = 1
    return {
      brandId: this.brandId,
      buyer: this.buyer,
      agent: this.agent,
      description: this.description,
      duration: this.duration,
      isActive: this.isActive,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.contract.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.brandId = data.brand_id;
      this.buyer = data.buyer;
      this.agent = data.agent;
      this.description = data.description;
      this.duration = data.duration;
      this.isActive = data.is_active;
      this.startTime = moment(data.start_time).format("MM/DD/YYYY hh:mm");
      this.endTime = moment(data.end_time).format("MM/DD/YYYY hh:mm");
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
      let { brandId, buyer, agent, description, duration,
        isActive, startTime, endTime, status } = this;
      let brand_id = brandId
      let is_active = isActive
      let start_time = moment(startTime, "MM/DD/YYYY hh:mm").toDate();
      let end_time = moment(endTime, "MM/DD/YYYY hh:mm").toDate();
      await this.innowayApi.contract.add({
        brand_id, buyer, agent, description, duration,
        is_active, start_time, end_time, status
      })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { brandId, buyer, agent, description, duration,
        isActive, startTime, endTime, status } = this;
      let brand_id = brandId
      let is_active = isActive
      let start_time = moment(startTime, "MM/DD/YYYY hh:mm").toDate();
      let end_time = moment(endTime, "MM/DD/YYYY hh:mm").toDate();
      await this.innowayApi.contract.update(this.id, {
        brand_id, buyer, agent, description, duration,
        is_active, start_time, end_time, status
      })
      this.alertUpdateSuccess();
      form.reset();
    } else {
      this.alertFormNotValid();
    }
  }

  async submitAndNew(form: NgForm) {
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
