import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from 'app/services/innoway';
import { JsonEditorOptions, JsonEditorComponent } from "angular4-jsoneditor/jsoneditor/jsoneditor.component";

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

  name: string;
  // description: string;
  shortDescription: string;
  image: string;
  status: number;

  @ViewChild("fileUploader")
  fileUploader: ElementRef;

  progress: boolean | number = false;

  isUploadImage: boolean = false;
  fileUpload: File;
  previewImage: string;
  closeImage: string = "https://d30y9cdsu7xlg0.cloudfront.net/png/55049-200.png";
  errorImage: string = "http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png";

  public editorOptions: JsonEditorOptions;
  public metaData: any;
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService
  ) {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
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
    this.status = 1
    this.name = null
    this.shortDescription = null
    // this.description = null
    this.previewImage = null

    this.metaData = {
      "lang": {
        "en": {
          "name": "",
          "short_description": "",
          "description": ""
        }
      }
    }

    return {
      status: this.status,
      name: this.name,
      shortDescription: this.shortDescription,
      // description: this.description,
      previewImage: this.previewImage,
      metaData: this.metaData
    }
  }

  async setData() {
    try {
      let category = await this.innowayApi.blogType.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.name = category.name
      this.image = category.thumb
      this.previewImage = category.thumb
      this.shortDescription = category.short_description
      // this.description = category.description
      let dataDefault: any = {
        "lang": {
          "en": {
            "name": "",
            "short_description": "",
            "description": ""
          }
        }
      }
      this.metaData = JSON.stringify(category.meta_data) != "{}" ? category.meta_data : dataDefault
      this.editor.set(this.metaData)
      this.status = category.status
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
      let { name, previewImage, status, shortDescription, metaData } = this;
      let short_description = shortDescription;
      let thumb = previewImage
      let meta_data: any = this.editor.get()
      await this.innowayApi.blogType.add({ name, short_description, thumb, status, meta_data })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, previewImage, status, shortDescription, metaData } = this;
      let short_description = shortDescription
      let thumb = previewImage
      let meta_data: any = this.editor.get()
      await this.innowayApi.blogType.update(this.id, { name, short_description, thumb, status, meta_data })
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
