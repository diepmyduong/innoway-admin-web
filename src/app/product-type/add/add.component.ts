import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayService } from '../../services';

declare var swal: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;
  categoryService: any;

  name: string;
  description: string;
  image: string;
  status: number;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService
  ) {
    this.categoryService = innoway.getService('product_category');
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
    this.status = 1;
  }

  async setData() {
    try {
      let category = await this.categoryService.get(this.id, {
        fields: ["name", "description", "image", "status"]
      });
      this.name = category.name
      this.image = category.image
      this.description = category.description
      this.status = category.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.router.navigate(['product-type'])
    }
  }

  backToList() {
    this.router.navigate(['/product-type/list'])
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
      let { name, description, image } = this;
      await this.categoryService.add({ name, description, image })
      this.alertAddSuccess();
      form.reset();
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, description, image, status } = this;
      await this.categoryService.update(this.id, { name, description, image, status })
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
