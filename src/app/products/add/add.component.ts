import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { CustomValidators } from 'ng2-validation';

import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { UploadImageByUrlComponent, TextCardModalContext } from '../../modal/upload-image-by-url/upload-image-by-url.component';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { PageService } from '../../chatbot/services/page.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';

declare var innoway2: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  form: FormGroup = null;
  id: any = [];
  isEdit: boolean = false;
  statuses: number[] = [1, 0];
  indexSelectedStatus: number = 0;
  indexSelectedCategory: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";

  product: any = [];
  categories: any[] = [{}];
  toppings: any[] = [{}];
  toppingValues: any[][] = [];
  countTopping: number = 0;

  images: Array<string> = [];

  public notification_option = {
    position: ["top", "right"],
    timeOut: 1000,
    lastOnBottom: true,
  };

  constructor(
    private modal: Modal,
    private pageService: PageService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private _service: NotificationsService,
    private ref: ChangeDetectorRef,
    vcRef: ViewContainerRef
  ) {
    this.form = new FormGroup({
      nameInput: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      priceInput: new FormControl(null, [Validators.required, CustomValidators.min(1000)]),
      basePriceInput: new FormControl(null),
      descriptionInput: new FormControl(null),
      toppingInput: new FormControl(null),
      categoryInput: new FormControl(null),
      unitInput: new FormControl(null),
      attributeInput: new FormControl(null),
      statusInput: new FormControl(null, Validators.required),
      imageUrlsInput: new FormArray([])
    });

    modal.overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {

    this.getCategories();
    this.getToppings();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id == null) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }
  }

  async getToppings() {
    this.toppings = await innoway2.api.module('topping').getAll();
    if (this.toppings != null && this.toppings.length > 0) {
      this.value = this.toppings[0].name;
      this.toppings.forEach(topping => {
        let item = {
          text: topping.name,
          id: topping.id
        };
        this.items.push(item);
      });
    }
    //alert(this.items[0]);
    this.ref.detectChanges();
  }

  async addToppingValuesById(id) {
    this.toppingValues[this.countTopping] = [];
    this.toppingValues[this.countTopping] = await innoway2.api.module('topping_value').getAllWithQuery({
      topping_id: this.toppings[this.countTopping].id
    });
    alert(this.toppingValues[this.countTopping].length);
    this.countTopping++;
    this.ref.detectChanges();
  }

  async getCategories() {
    this.categories = await innoway2.api.module('product_category').getAll();
    this.ref.detectChanges();
  }

  async setData() {
    this.product = await innoway2.api.module('product').get(this.id);
    console.log('Set Data', this.product);
    this.form.controls['name'].setValue(this.product.name);
    this.form.controls['description'].setValue(this.product.description);
    this.form.controls['image'].setValue(this.product.image);
    this.ref.detectChanges();
  }

  onChangeCategory(index) {
    this.indexSelectedCategory = index;
    alert(index);
  }

  onChangeStatus(index) {
    this.indexSelectedStatus = index;
  }

  submitAndNew() {
    alert(this.form.controls['statusInput'].value + " - " + this.form.controls['categoryInput'].value);
    if (this.form.valid) {
      this.addToppingValue(false);
    } else {
      this.createNotification("Xảy ra lỗi", "Nội dung chưa hợp lệ!");
    }
  }

  submitAndClose() {
    if (this.form.valid) {
      this.addToppingValue(true);
    } else {
      this.createNotification("Xảy ra lỗi", "Nội dung chưa hợp lệ!");
    }
  }

  updateAndClose() {
    this.product = {
      "name": this.form.controls['nameInput'].value,
      "price": this.form.controls['priceInput'].value,
      "description": this.form.controls['descriptionInput'].value,
      "category": this.form.controls['categoryInput'].value,
      "base_price": this.form.controls['basePriceInput'].value,
      "topping": this.form.controls['toppingInput'].value,
      "unit": this.form.controls['unitInput'].value,
      "attribute": this.form.controls['attributeInput'].value,
      "status": this.form.controls['statusInput'].value,
      "stock": this.form.controls['stockInput'].value
    };

    // alert(JSON.stringify(this.product));
    if (this.form.valid) {
      innoway2.api.module('product_product').update(this.id, this.product).then(data => {
        this.zone.run(() => {
          this.createNotification(this.product.name, "Cập nhật " + this.product.name + " thành công!");
        });
      }).catch(err => {
        console.error(err);
      });
    }
  }

  addToppingValue(isNagativeToDashboard) {
    this.product = {
      "name": this.form.controls['nameInput'].value,
      "price": this.form.controls['priceInput'].value,
      "description": this.form.controls['descriptionInput'].value,
      "category": this.form.controls['categoryInput'].value,
      "base_price": this.form.controls['basePriceInput'].value,
      "topping": this.form.controls['toppingInput'].value,
      "unit": this.form.controls['unitInput'].value,
      "attribute": this.form.controls['attributeInput'].value,
      "status": this.form.controls['statusInput'].value,
      "stock": this.form.controls['stockInput'].value
    };

    // alert(JSON.stringify(this.product));

    innoway2.api.module('product_product').add(this.product).then(data => {
      this.zone.run(() => {
        this.createNotification(this.product.name, "Thêm " + this.product.name + " thành công!");
      });
      if (isNagativeToDashboard) {
        this.router.navigate(['/dashboard']);
      } else {
        this.product = [];
        this.form.controls['name'].setValue("");
        this.form.controls['description'].setValue("");
        this.form.controls['image'].setValue("");
      }
    }).catch(err => {
      console.error(err);
    });
  }

  unmaskPrice(raw) {
    let price = parseFloat(raw.replace(new RegExp("(,)|(Đồng)|(\ )", "g"), ""));
    this.form.controls['price'].setValue(price);
    return price;
  }

  createNotification(title, content) {
    this._service.success(
      title.toString(),
      content.toString(),
      {
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
      }
    )
  }

  errorHandler(event) {

  }

  validateData(isEdit, data, field) {
    let output;
    if (isEdit) {
      if (data == null) {
        output = "";
        this.product[field] = "";
      } else {
        output = data;
        this.product[field] = data;
      }
    } else {
      if (data == null) {
        output = "";
        this.product[field] = "";
      } else {
        output = data;
        this.product[field] = data;
      }
    }
    return output;
  }

  private value: any = [];

  public items: Array<any> = [];

  public selected(value: any): void {
    console.log('Selected value is: ', value);
    // alert(JSON.stringify(value));
    this.addToppingValuesById(value.id);
    //alert(this.toppings.length);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
    this.removeTopping(value.id);
    alert(this.toppings.length);
  }

  private removeTopping(id) {
    this.toppings.forEach(topping => {
      if (topping.id === id) {
        let count = 0;
        this.toppingValues.forEach(toppingValue => {
          if (toppingValue[count].topping_id === id) {
            this.toppingValues[count] = this.toppingValues[count].filter(item => item.id !== id);
            //throw Error();
          }
          count++;
        });
        //this.toppings = this.toppings.filter(item => item.id !== id);
        this.countTopping--;
        //throw Error();
        this.ref.detectChanges();
      }
    });
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }

  showModal(type, option = {}) {
    switch (type) {
      case "text_card":
        return this.modal.open(UploadImageByUrlComponent,
          overlayConfigFactory(option, TextCardModalContext));
      default:
        break;
    }
  }

  addImageModal() {
    this.showModal("text_card", {
      data: {
        text: null
      }
    }).then(modal => {
      modal.result.then(res => {
        if (res) {
          alert(JSON.stringify(res));
          this.images.push(res.text);
          this.ref.detectChanges();
        }
      });
    });
  }

  //  private addImage(){
  //  	if(this.imageUrlsInput.length>0){
  //  		let isAdd=true;
  //   	for(let i = 0; i < this.imageUrlsInput.length; i++) {
  // 	  if(this.imageUrlsInput.at(i).value==null||this.imageUrlsInput.at(i).value==''){
  // 	  	alert("Error!");
  // 	  	isAdd=false;
  // 	  	break;
  // 	  }
  //     }
  //     if(isAdd){
  //     	// updateImageToUI
  //     	this.imageUrlsInput.push(new FormControl());
  //  			this.ref.detectChanges();
  //     }
  // }else{
  // 	this.imageUrlsInput.push(new FormControl());
  //  		this.ref.detectChanges();
  // }
  //  }

  //  private updateImageToUI(data){
  //  	this.images.push(data);
  //  }

  //  private deleteImage(index){
  // 	this.imageUrlsInput.removeAt(index);
  //  	this.ref.detectChanges();
  //  }

  //  updateImageUrl(event){
  //  	alert(JSON.stringify(event));
  //  }

}
