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
  detailId: any;
  isEdit: boolean = false;

  submitting: boolean = false;

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

  contractId: string
  parentId: string
  descriptionLicense: string
  statusLicense: number

  licenseId: string
  startTime: string
  endTime: string
  price: number
  numberOfTransaction: number
  numberOfUsedTransaction: number
  types = [
    {
      name: "transaction",
      code: "transaction"
    },
    {
      name: "month",
      code: "month"
    },
    {
      name: "initialize",
      code: "initialize"
    },
    {
      name: "trial",
      code: "trial"
    }
  ]
  type: string
  transactionTypes: any[] = [
    {
      name: "completed_bill",
      code: "completed_bill"
    },
    {
      name: "account",
      code: "account"
    },
    {
      name: "smart_code",
      code: "smart_code"
    },
    {
      name: "promotion",
      code: "promotion"
    },
    {
      name: "message",
      code: "message"
    },
  ]
  transactionType: string
  descriptionLicenseDetail: string
  status: number

  setDefaultData() {
    this.contractId = null
    this.parentId = null
    this.descriptionLicense = null
    this.statusLicense = 0
    this.licenseId = null
    this.startTime = moment(Date.now()).format()
    this.endTime = moment(Date.now()).add(30, 'days').format()
    this.price = 0
    this.numberOfTransaction = 0
    this.numberOfUsedTransaction = 0
    this.type = null
    this.transactionType = null
    this.descriptionLicenseDetail = null
    this.status = 1
    return {
      contractId: this.contractId,
      parentId: this.parentId,
      descriptionLicense: this.descriptionLicense,
      statusLicense: this.statusLicense,
      licenseId: this.licenseId,
      startTime: this.startTime,
      endTime: this.endTime,
      price: this.price,
      numberOfTransaction: this.numberOfTransaction,
      numberOfUsedTransaction: this.numberOfUsedTransaction,
      type: this.type,
      transactionType: this.transactionType,
      descriptionLicenseDetail: this.descriptionLicenseDetail,
      status: this.status,
    }
  }

  async setData() {
    try {
      let licenseData = await this.innowayApi.license.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      let data = await this.innowayApi.licenseDetail.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.contractId = licenseData.contract_id
      this.parentId = licenseData.parent_id
      this.descriptionLicense = licenseData.description_license
      this.statusLicense = licenseData.status
      this.licenseId = data.license_id
      this.startTime = moment(data.start_time).format("MM/DD/YYYY hh:mm")
      this.endTime = moment(data.end_time).format("MM/DD/YYYY hh:mm")
      this.price = data.price
      this.numberOfTransaction = data.number_of_transaction
      this.numberOfUsedTransaction = data.number_of_used_transaction
      this.type = data.type
      this.transactionType = data.transaction_type
      this.descriptionLicenseDetail = data.descripiton
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

  // contract_id?: string,
  // parent_id?:string,
  // description?: string,
  // license_id?: string,
  // start_time?: Date,
  // end_time?: Date,
  // price?: number,
  // number_of_transaction?: number,
  // number_of_used_transaction?: number,
  // type?: "transaction" | "month" | "initialize" | "trial",
  // transaction_type?: "completed_bill" | "account" | "smart_code" | "promotion" | "message",
  // description?: string

  async addItem(form: NgForm) {
    if (form.valid) {
      let { contractId, parentId, descriptionLicense, statusLicense,
        licenseId, startTime, endTime, price, numberOfTransaction, numberOfUsedTransaction,
        type, transactionType, descriptionLicenseDetail } = this;
      let contract_id = contractId
      let parent_id = parentId
      let description = descriptionLicense
      let status = statusLicense
      let responseLicense = await this.innowayApi.license.add({
        contract_id, parent_id, description, status
      })

      let license_id = responseLicense.id
      let start_time = moment(startTime, "MM/DD/YYYY hh:mm").toDate();
      let end_time = moment(endTime, "MM/DD/YYYY hh:mm").toDate();
      let number_of_transaction = numberOfTransaction
      let number_of_used_transaction = numberOfUsedTransaction
      let transaction_type = transactionType
      description = descriptionLicenseDetail
      await this.innowayApi.contract.add({
        license_id, start_time, end_time, price, number_of_transaction,
        number_of_used_transaction, type, transaction_type, description
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
      let { contractId, parentId, descriptionLicense, statusLicense,
        licenseId, startTime, endTime, price, numberOfTransaction, numberOfUsedTransaction,
        type, transactionType, descriptionLicenseDetail } = this;
      let contract_id = contractId
      let parent_id = parentId
      let description = descriptionLicense
      let status = statusLicense
      let responseLicense = await this.innowayApi.license.update(this.id, {
        contract_id, parent_id, description, status
      })

      let license_id = responseLicense.id
      let start_time = moment(startTime, "MM/DD/YYYY hh:mm").toDate();
      let end_time = moment(endTime, "MM/DD/YYYY hh:mm").toDate();
      let number_of_transaction = numberOfTransaction
      let number_of_used_transaction = numberOfUsedTransaction
      let transaction_type = transactionType
      description = descriptionLicenseDetail
      await this.innowayApi.contract.update(this.detailId, {
        license_id, start_time, end_time, price, number_of_transaction,
        number_of_used_transaction, type, transaction_type, description
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
