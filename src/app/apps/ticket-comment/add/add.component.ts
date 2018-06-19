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

  brandId: string
  parentId: string
  assigneeId: string
  ticketId: string
  employeeId: string
  title: string
  attachedFiles: string
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

  // brandId: string
  // parentId: string
  // assigneeId: string
  // ticketId: string
  // employeeId: string
  // title: string
  // attachedFiles: string
  // status: number

  setDefaultData() {
    this.brandId = null
    this.employeeId = null
    this.parentId = null
    this.assigneeId = null
    this.ticketId = null
    this.title = null
    this.attachedFiles = null
    this.status = 1
    return {
      brandId: this.brandId,
      employeeId: this.employeeId,
      parentId: this.parentId,
      assigneeId: this.assigneeId,
      ticketId: this.ticketId,
      title: this.title,
      attachedFiles: this.attachedFiles,
      status: this.status
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.contract.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.brandId = data.brand_id
      this.employeeId = data.employee_id
      this.parentId = data.parent_id
      this.assigneeId = data.assignee_id
      this.ticketId = data.ticket_id
      this.title = data.title
      this.attachedFiles = data.attached_files
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
      let { brandId, employeeId, parentId, assigneeId, ticketId, title,
        attachedFiles, status } = this;
      let brand_id = brandId
      let employee_id = employeeId
      let parent_id = parentId
      let assignee_id = assigneeId
      let ticket_id = ticketId
      let attached_files = attachedFiles
      await this.innowayApi.contract.add({
        brand_id, employee_id, parent_id, assignee_id, ticket_id, title,
        attached_files, status
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
      let { brandId, employeeId, parentId, assigneeId, ticketId, title,
        attachedFiles, status } = this;
      let brand_id = brandId
      let employee_id = employeeId
      let parent_id = parentId
      let assignee_id = assigneeId
      let ticket_id = ticketId
      let attached_files = attachedFiles
      await this.innowayApi.contract.update(this.id, {
        brand_id, employee_id, parent_id, assignee_id, ticket_id, title,
        attached_files, status
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
