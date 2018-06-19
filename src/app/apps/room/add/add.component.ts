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

  name: string
  named: string
  type: string
  actions: string
  properties: string
  isTurnOn: boolean
  ip: string
  brandDevice: string
  roomId: string
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

  setDefaultData() {
    this.name = null
    this.named = null
    this.type = null
    this.actions = null
    this.properties = null
    this.isTurnOn = true
    this.ip = null
    this.brandDevice = null
    this.roomId = null
    this.status = 1
    return {
      name: this.name,
      named: this.named,
      type: this.type,
      actions: this.actions,
      properties: this.properties,
      isTurnOn: this.isTurnOn,
      ip: this.ip,
      brandDevice: this.brandDevice,
      roomId: this.roomId,
      status: this.status
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.contract.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.name = data.name
      this.named = data.named
      this.type = data.type
      this.actions = data.actions
      this.properties = data.properties
      this.isTurnOn = data.is_turn_on
      this.ip = data.ip
      this.brandDevice = data.brand_device
      this.roomId = data.room_id
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
      let { name, named, type, actions, properties,
        isTurnOn, ip, brandDevice, roomId, status } = this;
      let is_turn_on = isTurnOn
      let brand_device = brandDevice
      let room_id = roomId
      await this.innowayApi.contract.add({
        name, named, type, actions, properties,
        is_turn_on, ip, brand_device, room_id, status
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
      let { name, named, type, actions, properties,
        isTurnOn, ip, brandDevice, roomId, status } = this;
      let is_turn_on = isTurnOn
      let brand_device = brandDevice
      let room_id = roomId
      await this.innowayApi.contract.update(this.id, {
        name, named, type, actions, properties,
        is_turn_on, ip, brand_device, room_id, status
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
