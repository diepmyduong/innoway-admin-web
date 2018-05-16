import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from 'rxjs/Subscription'
import { SelectComponent } from 'ng2-select';
import * as Ajv from 'ajv';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { InnowayApiService, iTopping } from 'app/services/innoway'
import { Globals } from './../../../globals';
import { MatDialog } from '@angular/material';
import { EditInfoDialog } from "../../../modal/edit-info/edit-info.component";

declare var swal, _: any;

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
  public description;
  shortDescription: string;
  category: string;
  product_type: string = null;
  status: number = 1;
  topping: string;
  base_price: string;
  price: string;
  list_image: any[] = [];
  image_on_hover: number;
  unit: string = null;
  attribute: string;
  thumb: string;
  topping_items = new BehaviorSubject<any[]>([]);

  toppingValues = new BehaviorSubject<any[]>([]);
  categories = new BehaviorSubject<any[]>([]);
  toppings = new BehaviorSubject<iTopping[]>([]);
  units = new BehaviorSubject<any[]>([]);
  attributes = new BehaviorSubject<any[]>([]);
  productTypes = new BehaviorSubject<any[]>([]);

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  @ViewChild('categoryControl') categoryControl: NgModel;
  @ViewChild('toppingSelecter') toppingSelecter: SelectComponent;
  @ViewChild('imageSwiper') imageSwiper: any;

  imageConfig = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    slidesPerView: 3,
    centeredSlides: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 10
  };
  subscriptions: Subscription[] = []

  @ViewChild("fileUploader")
  fileUploader: ElementRef;

  isUploadImage: boolean = false;
  fileUpload: File;
  previewImage: string;
  closeImage: string = "https://d30y9cdsu7xlg0.cloudfront.net/png/55049-200.png";
  errorImage: string = "http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService,
    public globals: Globals,
    public dialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    await Promise.all([
      this.loadCategoryData(),
      this.loadToppingData(),
      this.loadUnitData(),
      this.loadProductTypeData()
    ])
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
  }

  setDefaultData() {
    this.status = 1;
    this.price = '0';
    this.base_price = '0';
    this.description = '';
    this.shortDescription = '';
    if (this.categories.getValue()[0]) {
      this.category = this.categories.getValue()[0].id;
    }
    if (this.units.getValue()[0]) {
      this.unit = this.units.getValue()[0].id;
    }
    if (this.productTypes.getValue()[0]) {
      this.product_type = this.productTypes.getValue()[0].id;
    }
    let toppings = this.toppings.getValue().map(topping => {
      topping.selected = false;
      return topping;
    });
    this.toppingSelecter.active = []
    this.toppings.next(toppings);
    this.list_image = [];
    this.thumb = null;
    this.unit = null;
    this.product_type = null;

    return {
      status: this.status,
      category: this.category,
      price: this.price,
      base_price: this.base_price,
      description: this.description,
      shortDescription: this.shortDescription,
      toppings: this.toppings,
      list_image: this.list_image,
      thumb: this.thumb,
      unit: this.unit,
      product_type: this.product_type
    }
  }

  async loadCategoryData() {
    try {
      this.categories.next(await this.innowayApi.productCategory.getList({
        local: false, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
      this.ref.detectChanges()
    } catch (err) {
      console.error('Cannot load category', err);
    }
  }

  async loadProductTypeData() {
    try {
      this.productTypes.next(await this.innowayApi.productType.getList({
        local: false, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
      this.ref.detectChanges()
    } catch (err) {
      console.error('Cannot load product_type', err);
    }
  }

  async loadToppingData() {
    try {
      const toppings = await this.innowayApi.topping.getList({
        local: false, query: {
          fields: ["id", "description", "name", {
            values: ["$all"]
          }],
          limit: 0
        }
      })
      this.toppings.next(toppings)
      this.topping_items.next(toppings.map(topping => {
        return {
          text: `${topping.name} ${(topping.description) ? (' (' + topping.description + ')') : ''}`,
          id: topping.id
        }
      }))
      console.log('toppings', toppings)
      this.ref.detectChanges()
    } catch (err) {
      console.error("cannot load toppings", err);
    }
  }

  async loadUnitData() {
    try {
      this.units.next(await this.innowayApi.unit.getList({
        local: false, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
      this.ref.detectChanges()
    } catch (err) {
      console.error("cannot load units", err);
    }
  }

  async getToppingValues(topping_id: string) {
    try {
      let topping = await this.innowayApi.topping.getItem(topping_id, {
        local: false, reload: true, query: {
          fields: [{
            values: ["$all"]
          }]
        }
      })
      return topping.values;
    } catch (err) {
      console.log('cannot load values', err)
      return null
    }
  }

  async setData() {
    try {
      let product = await this.innowayApi.product.getItem(this.id, {
        local: false, reload: true, query: {
          fields: ["$all", {
            toppings: ["id", "topping_id"]
          }]
        }
      })

      console.log("setdata", product)
      this.name = product.name
      this.thumb = product.thumb
      this.description = product.description
      this.shortDescription = product.short_description
      this.price = _.toString(product.price)
      this.base_price = _.toString(product.base_price)
      this.unit = product.unit_id ? product.unit_id : null
      this.status = product.status
      this.category = product.category_id ? product.category_id : null
      this.list_image = product.list_image
      this.product_type = product.product_type_id ? product.product_type_id : null
      let toppings = this.toppings.getValue()
      this.toppingSelecter.active = product.toppings.map(product_topping => {
        const topping = toppings.find(t => t.id === product_topping.topping_id)
        // let index = _.findIndex(toppings, { id: product_topping.topping.id });
        // toppings[index].values = product_topping.topping.values;
        // toppings[index].selected = true;
        return {
          id: topping.id,
          text: `${topping.name} ${(topping.description) ? (' (' + topping.description + ')') : ''}`,
        }
      })
      // this.toppings.next(toppings);
      this.ref.detectChanges();
    } catch (err) {
      console.log('ERROR', err);
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

  async addImage() {
    let image = await swal({
      title: 'Nhập URL hình ảnh',
      input: 'text',
      showCancelButton: true,
      cancelButtonText: 'Đóng',
      confirmButtonText: 'Nhập',
      showLoaderOnConfirm: true,
      preConfirm: ((image) => {
        return new Promise((function(resolve, reject) {
          let ajv = new Ajv();
          let valid = ajv.validate({ type: "string", format: 'url' }, image);
          if (!valid) {
            reject("Yêu cầu nhập đúng định dạng URL");
            return;
          }
          if (!(this.list_image.length < 5)) {
            reject("Chỉ có thể nhập tối đa 5 hình");
            return;
          }
          resolve()
        }).bind(this));
      }).bind(this),
      allowOutsideClick: false
    });

    let result = await swal({
      imageUrl: image,
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      confirmButtonText: 'Lưu & Nhập tiếp',
      imageWidth: 400,
      imageHeight: 200,
      animation: false
    });
    this.list_image.push(image);
    this.addImage();
  }

  async removeImage(index) {
    _.pullAt(this.list_image, [index]);
    // this.imageSwiper.Swiper.onResize();
  }

  async setThumbnail(index) {
    this.thumb = this.list_image[index];
  }

  async submitAndNew(form: NgForm) {
    this.submitting = true;
    try {
      if (form.valid) {
        let { name, shortDescription, description, list_image, thumb, price, base_price, unit, status } = this;

        let category_id = this.category ? this.category : undefined;
        let short_description = this.shortDescription;
        let unit_id = this.unit ? this.unit : undefined;
        let product_type_id = this.product_type ? this.product_type : undefined;
        let product = await this.innowayApi.product.add({ name, short_description, description, thumb, price: this.globals.convertStringToPrice(price), base_price: this.globals.convertStringToPrice(base_price), status, category_id, unit_id, product_type_id, list_image })
        let toppings = this.toppingSelecter.active.map(item => {
          return item.id
        })
        if (toppings.length > 0) {
          await this.innowayApi.product.addToppings(product.id, toppings)
        }
        this.alertAddSuccess();
        form.resetForm(this.setDefaultData());
      } else {
        this.alertFormNotValid();
      }
    } catch (err) {
      this.alertAddFailed()
      console.log('submit has error', err);
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      if (form.valid) {
        let { name, shortDescription, description, list_image, thumb, price, base_price, unit, status } = this;
        let category_id = this.category ? this.category : undefined;
        let short_description = this.shortDescription;
        let unit_id = this.unit ? this.unit : undefined;
        let product_type_id = this.product_type ? this.product_type : undefined;
        let product = await this.innowayApi.product.add({ name, short_description, description, thumb, price: this.globals.convertStringToPrice(price), base_price: this.globals.convertStringToPrice(base_price), status, category_id, unit_id, product_type_id, list_image })
        let toppings = this.toppingSelecter.active.map(item => {
          return item.id
        })
        if (toppings.length > 0) {
          await this.innowayApi.product.addToppings(product.id, toppings)
        }
        this.alertAddSuccess();
        this.backToListForAddNew();
      } else {
        this.alertFormNotValid();
      }
    } catch (err) {
      this.alertAddFailed();
      console.log('submit has error', err);
    } finally {
      this.submitting = false;
    }
  }

  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
      if (form.valid) {
        let { name, description, list_image, thumb, price, base_price, unit, status, shortDescription } = this;
        let category_id = this.category ? this.category : undefined;
        let unit_id = this.unit ? this.unit : undefined;
        let product_type_id = this.product_type ? this.product_type : undefined;
        let short_description = this.shortDescription;
        let product = await this.innowayApi.product.update(this.id, { name, short_description, description, thumb, price: this.globals.convertStringToPrice(price), base_price: this.globals.convertStringToPrice(base_price), status, category_id, unit_id, product_type_id, list_image })
        let toppings = this.toppingSelecter.active.map(item => {
          return item.id ? item.id : undefined
        })
        if (toppings.length > 0) {
          await this.innowayApi.product.updateToppings(this.id, toppings)
        }
        this.alertUpdateSuccess();
        this.backToList();
      } else {
        this.alertFormNotValid();
      }
    } catch (err) {
      this.alertUpdateFailed();
      console.log('submit has error', err);
    } finally {
      this.submitting = false;
    }
  }

  async toppingSelected(value: any) {
    let { id } = value;
    let toppings = this.toppings.getValue();
    let index = _.findIndex(toppings, { id });
    if (!toppings[index].values) {
      toppings[index].values = await this.getToppingValues(id);
    }
    toppings[index].selected = true;
    this.toppings.next(toppings);

  }

  async toppingRemoved(value: any) {
    let { id } = value;
    let toppings = this.toppings.getValue();
    let index = _.findIndex(toppings, { id });
    toppings[index].selected = false;
    this.toppings.next(toppings);
  }

  getTopping(id: string) {
    return this.toppings.getValue().find(t => t.id === id)
  }

  showDialogAddNewEntity(entityType) {

    let data = {
      title: "Cập nhật thông tin",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      inputs: [],
    };

    let input: any = {};

    switch (entityType) {
      case "category":
        data.inputs.push({
          title: "Loại sản phẩm",
          property: "name",
          type: "text",
          current: "",
        })

        data.inputs.push({
          title: "Mô tả ngắn",
          property: "short_description",
          type: "text",
          current: "",
        })

        data.inputs.push({
          title: "Mô tả",
          property: "description",
          type: "text",
          current: "",
        })

        data.inputs.push({
          title: "Hình ảnh",
          property: "image",
          type: "text",
          current: "",
        })
        break;
      case "product-type":
        data.inputs.push({
          title: "Loại trạng thái",
          property: "name",
          type: "text",
          current: "",
        })

        data.inputs.push({
          title: "Mô tả",
          property: "description",
          type: "text",
          current: "",
        })

        break;
      case "topping-type":
        data.inputs.push({
          title: "Loại topping",
          property: "name",
          type: "text",
          current: "",
        })

        data.inputs.push({
          title: "Mô tả",
          property: "description",
          type: "text",
          current: "",
        })

        break;
      case "topping":
        data.inputs.push({
          title: "Topping",
          property: "name",
          type: "text",
          current: "",
        })

        let options = []
        this.toppings.getValue().forEach(item => {
          options.push({
            code: item.id,
            display: item.name,
          })
        })

        data.inputs.push({
          title: "Loại topping",
          property: "toppings",
          type: "select",
          current: "",
          options: options,
        })

        data.inputs.push({
          title: "Mô tả",
          property: "description",
          type: "text",
          current: "",
        })

        data.inputs.push({
          title: "Chi phí",
          property: "price",
          type: "number",
          current: "",
        })

        break;
      case "unit":
        data.inputs.push({
          title: "Đơn vị",
          property: "name",
          type: "text",
          current: "",
        })

        data.inputs.push({
          title: "Bước nhảy",
          property: "offset",
          type: "number",
          current: "",
        })

        data.inputs.push({
          title: "Mô tả",
          property: "description",
          type: "text",
          current: "",
        })

        break;
    }

    let dialogRef = this.dialog.open(EditInfoDialog, {
      width: '560px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        switch (entityType) {
          case "category":
            this.addNewCategory({
              name: result.name,
              short_description: result.short_description,
              description: result.description,
              image: result.image,
            })
            break;
          case "product-type":
            this.addNewProductType({
              name: result.name,
              description: result.description
            })
            break;
          case "topping-type":
            this.addNewToppingType({
              name: result.name,
              description: result.description
            })
            break;
          case "topping":
            this.addNewTopping({
              name: result.name,
              description: result.description,
              price: result.price,
              topping_id: result.toppings
            })
            break;
          case "unit":
            this.addNewUnit({
              name: result.name,
              offset: result.offset,
              description: result.description
            })
            break;
        }
      }
    })
  }

  async addNewCategory(data) {
    try {
      await this.innowayApi.productCategory.add(data);
      this.loadCategoryData();
    } catch (err) {
      console.log("addNewCategory", err)
    }
  }

  async addNewProductType(data) {
    try {
      await this.innowayApi.productType.add(data);
      this.loadProductTypeData()
    } catch (err) {

    }
  }

  async addNewToppingType(data) {
    try {
      await this.innowayApi.topping.add(data);
      this.loadToppingData()
    } catch (err) {

    }
  }

  async addNewTopping(data) {
    try {
      await this.innowayApi.toppingValue.add(data);
      this.loadToppingData()
    } catch (err) {

    }
  }

  async addNewUnit(data) {
    try {
      await this.innowayApi.unit.add(data);
      this.loadUnitData()
    } catch (err) {

    }
  }

  async onChangeImageFile(event) {
    // this.startLoading()
    let files = this.fileUploader.nativeElement.files
    let file = files[0]
    try {
      let response = await this.innowayApi.upload.uploadImage(file)
      this.previewImage = response.link
    } catch (err) {
      console.log("upload image", err)
    }
  }

  onImageError(event) {
    this.previewImage = this.errorImage;
  }

  onImageChangeData(event) {
    this.previewImage = event;
  }

  removePreviewImage() {
    this.previewImage = undefined;
  }
}
