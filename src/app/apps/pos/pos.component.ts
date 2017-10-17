import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
import { Globals } from "./../../globals";
import { InnowayService, AuthService } from "app/services";
declare let swal: any;

import { NgModel, FormControl } from "@angular/forms";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of'

export interface State {
  code: string;
  name: string;
}

export interface StateGroup {
  letter: string;
  states: State[];
}

@Component({
  selector: 'app-pos',
  providers: [Globals],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
})
export class PosComponent implements OnInit {
  swiperOptions: any;
  itemsChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  employeeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  branchData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  categoryData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  productData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  customerData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  employeeService: any;
  branchService: any;
  categoryService: any;
  productService: any;
  customerService: any;
  currentEmployee: any;
  subscriptions: any = {};

  productState: FormControl;
  autocompleteProduct: any;

  selectedProduct: Array<any> = new Array<any>();

  constructor(private innoway: InnowayService,
    private globals: Globals,
    private ref: ChangeDetectorRef,
    private auth: AuthService, ) {
    this.swiperOptions = {
      spaceBetween: 10,
      scrollbarHide: false,
      mousewheelControl: true,
      slidesPerView: 5,
      slidesPerColumn: 2,
      grabCursor: true
    }
    this.itemsChange = new BehaviorSubject<any[]>([]);
    this.employeeService = innoway.getService('employee');
    this.branchService = innoway.getService('branch');
    this.categoryService = innoway.getService('category');
    this.productService = innoway.getService('product');
    this.customerService = innoway.getService('customer');
    this.currentEmployee = this.auth.service.userInfo;

    this.productState = new FormControl();
    this.subscriptions.productStateValue = this.productState.valueChanges
      .debounceTime(500)
      .subscribe(key => {
        this.searchProduct(key).then(products => {
          this.autocompleteProduct = Observable.of(products)
        })
      })

  }

  async ngOnInit() {
    // this.getBranchData();
    // this.getCategoryData();
    this.getProductData();
    // this.getCustomerData();
    // this.getEmployeeData();
  }

  async getBranchData() {
    try {
      let data = await this.innoway.getAll('branch', {
        fields: ["$all"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async getCategoryData() {
    try {
      let data = await this.innoway.getAll('category', {
        fields: ["$all"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async getProductData() {
    try {
      let data = await this.innoway.getAll('product', {
        fields: ["$all"]
      });
      this.productData = data;
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async getCustomerData() {
    try {
      let data = await this.innoway.getAll('customer', {
        fields: ["$all"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async getEmployeeData() {
    try {
      let data = await this.innoway.getAll('employee', {
        fields: ["$all"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async queryProduct() {

  }

  async createBill() {
    // if (form.valid) {
    //   let { name, description, image, status } = this;
    //   await this.categoryService.add({ name, description, image, status })
    //   this.alertAddSuccess();
    //   form.reset();
    //   form.resetForm(this.setDefaultData());
    // } else {
    //   this.alertFormNotValid();
    // }
  }

  async reloadItems(params) {
    await this.getItems();
  }

  async getItems() {

  }

  addProduct(product) {
    this.selectedProduct.push(product);
    this.ref.detectChanges();
  }

  removeProduct() {

  }

  removeAllProduct() {
    this.selectedProduct = new Array<any>();
  }

  editProduct() {

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
      title: 'Cập nhật thành công',
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

  private _filter(states: State[], val: string) {
    const filterValue = val.toLowerCase();
    return states.filter(state => state.name.toLowerCase().startsWith(filterValue));
  }

  async searchProduct(key: string) {
    const productService = this.innoway.getService('product');
    let limit = 5;
    if (key == null || key == "") {
      limit = 0
    }
    console.log("bambi: " + key);
    return await productService.getAllWithQuery({
      fields: ["$all"],
      limit: limit,
      filter: {
        name: { $iLike: `%${key}%` }
      }
    })
  }
}
