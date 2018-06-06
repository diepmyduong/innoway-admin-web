import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from 'app/services/innoway';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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

  customerId: string = "82d4b8c0-5c9d-11e8-bd70-63b68d378e7f"
  billId: string = null
  productId: string = null
  toppingValueId: string = null

  type: string = null
  types: any[] = [
    {
      code: "return_product",
      name: "Return Product"
    }
  ]
  title: string
  content: string
  attachedFiles: string
  reportStatus: string = null
  reportStatuses: any[] = [
    {
      code: "to_do",
      name: "To do"
    },
    {
      code: "in_progress",
      name: "In Progress"
    },
    {
      code: "done",
      name: "Done"
    },
    {
      code: "not handle",
      name: "Not Handle"
    }
  ]

  status: number = 1

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

    this.title = null
    this.content = null
    this.type = null
    this.attachedFiles = null
    this.reportStatus = null
    this.status = 1

    return {
      title: this.title,
      content: this.content,
      type: this.type,
      attachedFiles: this.attachedFiles,
      reportStatus: this.reportStatus,
      status: this.status
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.exportHistory.getItem(this.id, {
        query: { fields: ["$all"] }
      })

      this.title = data.title
      this.content = data.content
      this.type = data.title
      this.attachedFiles = data.attached_files
      this.reportStatus = data.report_status
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
      let {
        title,
        content,
        type,
        attachedFiles,
        reportStatus,
        status
      } = this;

      let attached_files = attachedFiles
      let report_status = reportStatus

      await this.innowayApi.customerReport.add({
        title,
        content,
        type,
        attached_files,
        report_status,
        status
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
      let {
        title,
        content,
        type,
        attachedFiles,
        reportStatus,
        status
      } = this;

      let attached_files = attachedFiles
      let report_status = reportStatus

      await this.innowayApi.customerReport.update(this.id, {
        title,
        content,
        type,
        attached_files,
        report_status,
        status
      })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
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

  async onChangeImageFile(event) {
    let files = this.fileUploader.nativeElement.files
    let file = files[0]
    try {
      let response = await this.innowayApi.upload.uploadImage(file)
      this.previewImage = response.link
    } catch (err) {
    }
  }

  onImageError(event) {
    this.previewImage = this.errorImage;
  }

  onImageChangeData(event) {
    this.previewImage = event;
  }

  removeImage() {
    this.previewImage = undefined;
  }

  startLoading() {
    this.progress = 0;
    setTimeout(() => {
      this.progress = 0.5;
    }, 30000);
  }

  endLoading() {
    this.progress = 1;

    setTimeout(() => {
      this.progress = false;
    }, 200);
  }

  bills: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  products: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  async billOfCustomer(customerId: string) {
    try {
      let data = await this.innowayApi.customer.getItem(customerId, {
        query: {
          fields: ["$all", {
            bills: ["$all"]
          }]
        }
      })
      console.log("BiMap", JSON.stringify(data))
      this.bills.next(data.bills)
    } catch (err) {

    }
  }

  async productInBill(billId: string){
    try {
      let data = await this.innowayApi.bill.getItem(billId, {
        query: {
          fields: ["$all", {
            items: ["$all"]
          }]
        }
      })
      console.log("BiMap", JSON.stringify(data))
      this.products.next(data.items)
    } catch (err) {

    }
  }
}
