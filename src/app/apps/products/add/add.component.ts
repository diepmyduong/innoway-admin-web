import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from 'rxjs/Subscription'
import { SelectComponent } from 'ng2-select';
import * as Ajv from 'ajv';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { InnowayApiService } from 'app/services/innoway'
import { Globals } from './../../../globals';

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
  toppings = new BehaviorSubject<any[]>([]);
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService,
    public globals: Globals
  ) {
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    await this.loadCategoryData();
    await this.loadToppingData();
    await this.loadUnitData();
    await this.loadProductTypeData();
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
        local: true, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
    } catch (err) {
      console.error('Cannot load category', err);
    }
  }

  async loadProductTypeData() {
    try {
      this.productTypes.next(await this.innowayApi.productType.getList({
        local: true, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
    } catch (err) {
      console.error('Cannot load product_type', err);
    }
  }

  async loadToppingData() {
    try {

      this.subscriptions.push(this.toppings.subscribe(toppings => {
        let items = toppings.map(topping => {
          return {
            text: topping.name,
            id: topping.id
          }
        })
        this.topping_items.next(items);
      }))
      this.toppings.next(await this.innowayApi.topping.getList({
        local: true, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
    } catch (err) {
      console.error("cannot load toppings", err);
    }
  }

  async loadUnitData() {
    try {
      this.units.next(await this.innowayApi.unit.getList({
        local: true, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
    } catch (err) {
      console.error("cannot load units", err);
    }
  }

  async getToppingValues(topping_id: string) {
    try {
      let topping = await this.innowayApi.topping.getItem(topping_id, {
        local: true, reload: true, query: {
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
        local: true, reload: true, query: {
          fields: ["$all", {
            toppings: ["id", {
              topping: ["id", "name", {
                values: ["$all"]
              }]
            }]
          }]
        }
      })

      console.log("setdata", JSON.stringify(product))
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
      let toppings = this.toppings.getValue();
      this.toppingSelecter.active = product.toppings.map(product_topping => {
        let index = _.findIndex(toppings, { id: product_topping.topping.id });
        toppings[index].values = product_topping.topping.values;
        toppings[index].selected = true;
        return {
          id: product_topping.topping.id,
          text: product_topping.topping.name
        }
      })
      this.toppings.next(toppings);
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
}
