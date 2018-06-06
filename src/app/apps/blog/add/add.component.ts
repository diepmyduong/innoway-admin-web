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

  title: string;
  public description;
  public content;
  shortDescription: string;
  image: string;
  status: number;
  blogType: string = null;
  blogTypes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  authorId: string;

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

    this.authorId = this.innowayApi.innowayAuth.innowayUser.id;
    this.loadBlogType();
  }

  async loadBlogType() {
    try {
      this.blogTypes.next(await this.innowayApi.blogType.getList({
        local: false, query: {
          fields: ["$all"],
          limit: 0
        }
      }));

      this.ref.detectChanges();
    } catch (err) {

    }
  }

  setDefaultData() {
    this.status = 1
    this.title = null
    this.shortDescription = null
    this.description = null
    this.previewImage = null
    this.authorId = null
    this.content = null
    this.blogType = null

    if (this.blogTypes.getValue()[0]) {
      this.blogType = this.blogTypes.getValue()[0].id;
    }

    return {
      status: this.status,
      title: this.title,
      shortDescription: this.shortDescription,
      description: this.description,
      previewImage: this.previewImage,
      authorId: this.authorId,
      content: this.content,
      blogType: this.blogType
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.blog.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.title = data.title
      this.image = data.thumb
      this.previewImage = data.thumb
      this.shortDescription = data.short_description
      this.description = data.description
      this.status = data.status
      this.authorId = data.author_id
      this.content = data.content
      this.blogType = data.blog_category_id
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
      let { title, description, previewImage, status, shortDescription, blogType, authorId, content } = this;
      let short_description = shortDescription;
      let author_id = authorId
      let thumb = previewImage
      let blog_category_id = blogType
      await this.innowayApi.blog.add({ title, description, short_description, thumb, status, blog_category_id, author_id, content })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { title, description, previewImage, status, shortDescription, blogType, authorId, content } = this;
      let short_description = shortDescription;
      let author_id = authorId
      let thumb = previewImage;
      let blog_category_id = blogType
      await this.innowayApi.blog.update(this.id, { title, description, short_description, thumb, status, blog_category_id, author_id, content })
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
