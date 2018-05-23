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

  employeeId: string = null
  productId: string = null
  products: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  toppingId: string = null
  toppings: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  toppingValueId: string = null
  toppingValues: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  storeId: string = null
  stores: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  supplierId: string = null
  suppliers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  amount: number
  note: string
  status: number = 1

  selectedProductId: string


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

    this.employeeId = this.innowayApi.innowayAuth.innowayUser.id;
    this.loadProduct()
    this.loadStore()
    this.loadSupplier()
  }

  async loadProduct() {
    try {
      this.products.next(await this.innowayApi.product.getList({
        query: {
          local: false,
          fields: ["$all"]
        }
      }));

      console.log("BiMap", JSON.stringify(this.products.getValue()))
    } catch (err) {

    }
  }

  async loadToppings(productId: string) {
    try {
      let response = await this.innowayApi.product.getItem(productId, {
        query: {
          fields: ["$all", {
            toppings: ["$all"]
          }]
        }
      });

      this.toppings.next(response.toppings);

      console.log("BiMap", JSON.stringify(this.toppings.getValue()))
    } catch (err) {

    }
  }

  async loadToppingValues(toppingId: string) {
    try {
      let response = await this.innowayApi.topping.getItem(toppingId, {
        query: {
          fields: ["$all", {
            values: ["$all"]
          }]
        }
      });

      this.toppingValues.next(response.values);

      console.log("BiMap", JSON.stringify(this.toppingValues.getValue()))
    } catch (err) {

    }
  }

  async loadSupplier() {
    try {
      this.suppliers.next(await this.innowayApi.supplier.getList({
        query: {
          local: false,
          fields: ["$all"]
        }
      }));
    } catch (err) {

    }
  }

  async loadStore() {
    try {
      this.stores.next(await this.innowayApi.store.getList({
        query: {
          local: false,
          fields: ["$all"]
        }
      }));
    } catch (err) {

    }
  }

  setDefaultData() {

    this.employeeId = this.innowayApi.innowayAuth.innowayUser.id;
    if (this.suppliers.getValue()[0]) {
      this.supplierId = this.suppliers.getValue()[0].id;
    }
    if (this.stores.getValue()[0]) {
      this.storeId = this.stores.getValue()[0].id;
    }
    if (this.products.getValue()[0]) {
      this.productId = this.products.getValue()[0].id;
    }
    this.toppingValueId = null
    this.amount = null
    this.note = null
    this.status = 1

    return {
      employeeId: this.employeeId,
      supplierId: this.supplierId,
      storeId: this.storeId,
      productId: this.productId,
      toppingValueId: this.toppingValueId,
      amount: this.amount,
      note: this.note,
      status: this.status
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.importHistory.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.employeeId = data.employee_id
      this.supplierId = data.supplier_id
      this.storeId = data.store_id
      this.productId = data.product_id
      this.toppingValueId = data.topping_value_id
      this.amount = data.amount
      this.note = data.note
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
        employeeId,
        supplierId,
        storeId,
        productId,
        toppingValueId,
        amount,
        note,
        status
      } = this;

      let employee_id = employeeId
      let supplier_id = supplierId
      let store_id = storeId
      let product_id = productId
      let topping_value_id = toppingValueId

      await this.innowayApi.inventory.import({
        employee_id,
        supplier_id,
        store_id,
        product_id,
        // topping_value_id: topping_value_id ? topping_value_id : "",
        amount,
        note,
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
        employeeId,
        supplierId,
        storeId,
        productId,
        toppingValueId,
        amount,
        note,
        status
      } = this;

      let employee_id = employeeId
      let supplier_id = supplierId
      let store_id = storeId
      let product_id = productId
      let topping_value_id = toppingValueId

      await this.innowayApi.importHistory.update(this.id, {
        employee_id,
        supplier_id,
        store_id,
        product_id,
        // topping_value_id: topping_value_id ? topping_value_id : undefined,
        amount,
        note,
        status
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
}
