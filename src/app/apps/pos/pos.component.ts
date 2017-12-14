import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectorRef, NgZone, Inject, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
import * as moment from 'moment';
import { Globals } from "./../../globals";
import { InnowayService, AuthService } from "app/services";

import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { NgModel, FormControl, NgForm } from "@angular/forms";

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime'

import { DOCUMENT } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapsAPILoader } from "@agm/core";
import { SelectComponent } from "ng2-select";

import { EditInfoDialog } from "../../modal/edit-info/edit-info.component";

declare let swal: any;
const defaultDialogConfig = new MatDialogConfig();

export interface State {
  code: string;
  name: string;
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
  promotionData: any;//BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  responseOrderAtStore: BehaviorSubject<any> = new BehaviorSubject<any>({});

  employeeService: any;
  branchService: any;
  categoryService: any;
  productService: any;
  customerService: any;
  brandService: any;
  billService: any;

  subscriptions: any = {};

  productState: FormControl;
  autocompleteProduct: any;

  customerPhoneOnline: string = "";
  customerNameOnline: string = "";
  customerPhoneAtStore: string = "";
  customerNameAtStore: string = "";

  selectedProduct: Array<any> = new Array<any>();
  selectedTopping: Array<any> = new Array<any>();
  allProductData: Array<any> = new Array<any>();
  autocompleteCustomerData: Array<any> = new Array<any>();
  autocompleteCustomerNameData: Array<any> = new Array<any>();

  isChose: boolean = false;

  private numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  @ViewChild("addressInput")
  searchElementRef: ElementRef;

  dialogRef: MatDialogRef<ToppingDialog> | null;
  lastAfterClosedResult: string;
  lastBeforeCloseResult: string;
  actionsAlignment: string;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', '2', '0', '1', '7', ' ', /\d/, /\d/, ':', /\d/, /\d/];

  config = {
    disableClose: false,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '',
    height: '',
    minWidth: '',
    minHeight: '',
    maxWidth: 600,
    maxHeight: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: [

    ]
  };
  numTemplateOpens = 0;

  //summary

  outputAmountOfPriceItems = 0;
  outputSubFee = 0;
  outputVAT = 0;
  outputPromotion = 0;
  outputShipFee = 0;
  outputAmountOfPurchase = 0;

  //request

  note: string;
  longitude: string;
  latitude: string;

  receivedTime: string;
  shipMethod: string;

  totalAmount: string = "0";
  receiveAmount: string = "0";
  payAmount: string = "0";
  returnAmount: string = "0";
  remainAmount: string = "0";
  transactionTime: string = "1";

  employeeName: string = "";
  branchName: string = "";

  employeeId: string;
  customerId: string;
  branchId: string;
  promotionId: string;

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverNote: string;

  payerName: string;
  payerPhone: string;
  payerAddress: string;
  payerNote: string;

  channelOnline: string;
  channelOnlines: any[] = [];

  brand: any;
  promotion: any;
  branch: any;
  employee: any;
  customer: any;

  address: string;
  subFee: string = "0";
  subFeeNote: string;

  shipFee: string = "0";
  deliveryTime: any;
  paidType: string = "partical";

  channel: string;
  channels: any[];

  deliveryMethod: string;
  deliveryMethods: any[] = [];

  isVAT: boolean = false;
  isSelectBillAtStoreTab: boolean = true;
  isPickAtStore: boolean;
  vatValue: number;

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  constructor(private innoway: InnowayService,
    private globals: Globals,
    private ref: ChangeDetectorRef,
    private auth: AuthService,
    public zone: NgZone,
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any,
    private mapsAPILoader: MapsAPILoader) {
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
    this.brandService = innoway.getService('brand');
    this.billService = innoway.getService('bill');

    this.employee = this.auth.service.userInfo;

    this.channels = [this.globals.CHANNELS[0]];
    this.channel = this.channels[0].code;

    this.channelOnlines = [this.globals.CHANNELS[1], this.globals.CHANNELS[2]];
    this.channelOnline = this.channelOnlines[0].code;

    this.productState = new FormControl();
    this.subscriptions.productStateValue = this.productState.valueChanges
      .debounceTime(500)
      .subscribe(key => {
        this.searchProduct(key).then(products => {
          this.autocompleteProduct = Observable.of(products);
        })
      })

    dialog.afterOpen.subscribe(() => {
      if (!doc.body.classList.contains('no-scroll')) {
        doc.body.classList.add('no-scroll');
      }
    });
    dialog.afterAllClosed.subscribe(() => {
      doc.body.classList.remove('no-scroll');
    });

    this.deliveryTime = moment(Date.now()).format('MM/DD/yyyy hh:mm');
  }

  checkVAT(event) {
    this.isVAT = event;
    this.updateTotalAmount();
  }

  updateDeliveryTime(event) {
    // this.deliveryTime = new Date(event);
    console.log((new Date(event)).toString());
  }

  openToppingDialog(productId, data) {
    this.config.data = data;
    this.dialogRef = this.dialog.open(ToppingDialog, this.config);

    this.dialogRef.beforeClose().subscribe((result: string) => {
      this.lastBeforeCloseResult = result;
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      this.addToppingsToProduct(result, productId);
      this.lastAfterClosedResult = result;
      this.dialogRef = null;
    });
  }

  async ngOnInit() {
    this.allProductData = await this.getProductData();
    // this.employee = this.employee.fullname;
    this.employeeId = this.employee.id;
    this.employeeName = this.employee.fullname;

    console.log("bambi auth: " + JSON.stringify(this.employee));

    this.getBrandData(this.employee.brand_id);
    // this.getPromotionData();
    this.getBranchData(this.employee.branch_id);
    this.setAutocompleteMap();
  }

  async getBrandData(id: string) {
    try {
      let data = await this.brandService.get(id, {
        fields: ['$all', {
          'brand_ship': ['$all']
        }]
      })
      console.log("brand", JSON.stringify(data));
      this.brand = data;
      this.vatValue = data.vat_value == null || data.vat_value == 0 || data.vat_value == "0" ? 1 : Number.parseFloat(data.vat_value);
      if (data.brand_ship != null) {
        if (data.brand_ship.allow_ship) {
          this.deliveryMethods.push(this.globals.DELIVERY_METHODS[0]);
        }
        if (data.brand_ship.allow_pick_at_store) {
          this.deliveryMethods.push(this.globals.DELIVERY_METHODS[1]);
        }
        this.deliveryMethod = this.deliveryMethods[0].code;

        switch (this.deliveryMethod) {
          case this.globals.DELIVERY_METHODS[0].code:
            this.isPickAtStore = false;
            break;
          case this.globals.DELIVERY_METHODS[1].code:
            this.isPickAtStore = true;
            break;
        }

        this.ref.detectChanges();
      }
    } catch (err) {
      this.alertItemNotFound()
    }
  }

  async getBranchData(id: string) {
    console.log("branch_id: " + id);
    try {
      let data = await this.branchService.get(id, {
        fields: ["$all", "$paranoid"]
      })
      this.branch = data;
      this.branchId = this.branch.id;
      this.branchName = this.branch.name;
      console.log("address branch", JSON.stringify(data));
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  // async getPromotionData() {
  //   try {
  //     let data = await this.innoway.getAll('promotion', {
  //       fields: ["$all"]
  //     });
  //     this.promotionData = data;
  //     this.promotion = data._value[0].code;
  //     console.log("bambi promotion: " + JSON.stringify(data));
  //   } catch (err) {
  //     try { await this.alertItemNotFound() } catch (err) { }
  //     console.log("ERRRR", err);
  //   }
  // }

  async getProductData() {
    try {
      let data = await this.innoway.getAll('product', {
        fields: ["$all"],
        limit: 0,
      });

      this.productData = data;
      return this.productData.getValue()
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

  async getToppings(productId) {
    try {
      let data = await this.productService.get(productId, {
        fields: ["id", {
          toppings: ["id", {
            topping: ["id", "name", {
              values: ["id", "name", "price"]
            }]
          }]
        }]
      });
      this.selectedTopping = data.toppings != null ? data.toppings : null;
      if (this.selectedTopping != null) {
        this.openToppingDialog(productId, data.toppings);
      } else {
        this.alertItemNotFound();
      }
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  addProduct(product) {
    let isAvaible = false;
    let amount = 0;
    let price = Number.parseInt(product.price);
    let pos = -1;

    this.selectedProduct.forEach((item, index) => {
      if (item.id == product.id) {
        amount = item.amount;
        isAvaible = true;
        pos = index;
      }
    })

    amount++;
    let total = price * amount;

    let item = {
      id: product.id,
      name: product.name,
      amount: amount,
      thumb: product.thumb,
      price: product.price,
      total: total.toString(),
      toppings: [],
    }

    if (isAvaible) {
      this.selectedProduct[pos] = item;
    } else {
      this.selectedProduct.push(item);
    }

    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  addToppingsToProduct(toppings: any, id: string) {
    let pos = -1;
    this.selectedProduct.forEach((item, index) => {
      if (item.id == id) {
        pos = index;
        return;
      }
    })

    let product = this.selectedProduct[pos];
    product.toppings = toppings;

    let total = 0;
    product.toppings.forEach((item, index) => {
      total += Number.parseInt(item.price);
    });

    product.price = (Number.parseInt(product.price) + total).toString();
    product.total = (Number.parseInt(product.price) * Number.parseInt(product.amount)).toString();
    this.selectedProduct[pos] = product;

    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  removeProduct(product) {
    for (var i = this.selectedProduct.length; i--;) {
      if (this.selectedProduct[i].id === product.id) {
        this.selectedProduct.splice(i, 1);
      }
    }
    this.ref.detectChanges();
  }

  removeAllProduct() {
    this.selectedProduct = new Array<any>();
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
    if (key == null || key == "" || this.isChose) {
      this.isChose = false;
      return this.productData.next(this.allProductData);
    } else {
      return await productService.getAllWithQuery({
        fields: ["$all"],
        limit: limit,
        filter: {
          name: { $iLike: `%${key}%` }
        }
      })
    }
  }

  updateAmount(product, amount) {
    let isAvaible = false;
    let pos;

    this.selectedProduct.forEach((item, index) => {
      if (item.id == product.id) {
        isAvaible = true;
        pos = index;
      }
    })

    if (amount == 0) {
      this.removeProduct(product);
      return;
    }

    let total = Number.parseInt(amount) * Number.parseInt(product.price);

    let item = {
      id: product.id,
      name: product.name,
      amount: amount,
      thumb: product.thumb,
      price: product.price,
      total: total.toString(),
      toppings: product.toppings,
    }

    if (isAvaible) {
      this.selectedProduct[pos] = item;
    }

    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  updateTotalAmount() {
    let total = 0;
    this.selectedProduct.forEach(item => {
      total += Number.parseInt(item.total);
    })
    // this.totalAmount = total.toString();
    this.outputAmountOfPriceItems = total;
    if (this.isVAT == true) {
      this.outputVAT = (this.outputAmountOfPriceItems + this.outputSubFee) * this.vatValue;
    } else {
      this.outputVAT = 0;
    }
    console.log("VAT: " + this.isVAT + " --- " + this.outputVAT);
    this.calculateAmountOfPurchase();
    this.ref.detectChanges();
  }

  updateOutputSubFee(event) {
    // alert(JSON.stringify(event));
    this.outputSubFee = this.globals.convertStringToPrice(event);
  }

  private calculateRemainAndReturnAmount() {
    let totalAmount = this.globals.convertStringToPrice(this.totalAmount);
    let receiveAmount = this.globals.convertStringToPrice(this.receiveAmount);
    let payAmount = this.globals.convertStringToPrice(this.payAmount);
    this.remainAmount = (totalAmount - payAmount).toString();
    this.returnAmount = (receiveAmount - payAmount).toString();
    if (totalAmount == payAmount) {
      this.paidType = this.globals.PAID_HISTORY_TYPES[1].name;
    } else {
      this.paidType = this.globals.PAID_HISTORY_TYPES[0].name;
    }
    this.ref.detectChanges();
  }

  private calculateAmountOfPurchase() {

    this.outputPromotion = 0;
    if (this.promotion != null) {
      this.promotionData.forEach(data => {
        if (data.id == this.promotion) {
          switch (data.promotion_type) {
            case this.globals.PROMOTION_TYPES[0].code:
              this.outputPromotion = data.value;
              break;
            case this.globals.PROMOTION_TYPES[1].code:
              this.outputPromotion = (this.outputAmountOfPriceItems + this.outputSubFee) * data.value / 100;
              break;
          }
        }
      })
    }

    this.outputAmountOfPurchase = this.outputAmountOfPriceItems
      + this.outputShipFee
      + this.outputSubFee
      + this.outputVAT
      - this.outputPromotion;

    this.totalAmount = this.outputAmountOfPurchase.toString();

    this.calculateRemainAndReturnAmount();
  }

  displaySearchProduct(value: any): string {
    return null;
  }

  onChangeAutocompleteProduct(event, product) {
    this.isChose = true;
    this.addProduct(product);
  }

  setAutocompleteMap() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.zone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            this.shipFee = "0";
            return;
          }

          this.address = place.formatted_address;
          this.longitude = place.geometry.location.lng().toString();
          this.latitude = place.geometry.location.lat().toString();

          console.log(place.geometry.location.lng() + " --- " + place.geometry.location.lat());
          this.calculateShipFee(place.geometry.location.lng(), place.geometry.location.lat());

          this.ref.detectChanges();
        });
      });
    });
  }

  selectDeliveryMethod(data) {
    console.log("delivery method", JSON.stringify(data));
    switch (data) {
      case this.globals.DELIVERY_METHODS[0].code: {
        this.isPickAtStore = false;
        this.shipFee = "0";
        this.outputShipFee = Number.parseInt(this.shipFee);
        this.address = null;
        this.longitude = null;
        this.latitude = null;
      }
        break;
      case this.globals.DELIVERY_METHODS[1].code: {
        this.isPickAtStore = true;
        this.shipFee = "0";
        this.outputShipFee = 0;
        this.address = this.branch.address;
        this.longitude = this.branch.longitude;
        this.latitude = this.branch.latitude;
        console.log("address", this.branch.adress);
      }
        break;
    }
    this.ref.detectChanges();
    this.updateTotalAmount();
  }

  async calculateShipFee(longitude, latitude) {
    try {
      let data = {
        "longitude": longitude,
        "latitude": latitude
      }
      let fee = await this.billService.calculateShipFee(data);
      this.shipFee = fee.fee;
      if (!this.isSelectBillAtStoreTab) {
        this.outputShipFee = Number.parseInt(this.shipFee);
      } else {
        this.outputShipFee = 0;
      }
      this.ref.detectChanges();
      this.updateTotalAmount();
    } catch (err) {

    }
  }

  async detectCustomerByPhone(phone: string) {
    console.log("detect: " + phone);
    try {
      let data = {
        phone: phone.toString()
      }
      this.customer = await this.customerService.getCustomerByPhone(data);

      this.promotion = null;
      if (this.customer != null && this.customer.code != 500) {
        this.customerNameAtStore = this.customer.fullname ? this.customer.fullname : "Chưa cập nhật";
        this.getPromotionsByCustomerId(this.customer.id);
        this.customerId = this.customer.id;
      } else {
        this.customerId = null;
      }

      this.ref.detectChanges();
    } catch (err) {
      this.customerNameAtStore = null;
      this.customer = null;
      this.customerId = null;
      console.log("detect phone: " + err);
    }
  }

  async createNewCustomer(input: any) {

  }

  async getPromotionsByCustomerId(customerId) {
    try {
      let data = await this.customerService.getPromotions(customerId, {
        fields: ["$all"]
      });
      this.promotionData = data;
      console.log("promotion", JSON.stringify(data));
      this.ref.detectChanges();
      // alert(JSON.stringify(data))
    } catch (err) {
      alert(err.toString())
    }
  }

  selectCustomerPromotion(event) {
    this.promotionId = event;
    this.updateTotalAmount();
  }

  selectBillAtStoreTab() {
    this.outputShipFee = 0;
    this.isSelectBillAtStoreTab = true;
    this.updateTotalAmount();
  }

  selectBillOnlineTab() {
    this.outputShipFee = this.shipFee ? Number.parseInt(this.shipFee) : 0;
    this.isSelectBillAtStoreTab = false;
    this.updateTotalAmount();
  }

  async orderAtStore() {
    try {

      this.address = this.branch.address;
      this.longitude = this.branch.longitude;
      this.latitude = this.branch.latitude;

      let request = {
        "address": this.address,
        "longitude": this.longitude,
        "latitude": this.latitude,
        "sub_fee": this.globals.convertStringToPrice(this.subFee),
        "sub_fee_note": this.subFeeNote,
        "channel": this.channel,
        "pay_amount": this.globals.convertStringToPrice(this.payAmount),
        "receive_amount": this.globals.convertStringToPrice(this.receiveAmount),
        "branch_id": this.branchId,
        "employee_id": this.employee.id,
        "note": this.note,
        "promotion_id": this.promotionId,
        "customer_id": this.customerId,
        "products": []
      }

      let products = [];
      this.selectedProduct.forEach(product => {
        let item = {
          product_id: product.id,
          amount: product.amount,
          topping_value_ids: []
        }
        let toppings = [];
        product.toppings.forEach(topping => {
          toppings.push(topping.id)
        });

        item.topping_value_ids = toppings;
        products.push(item);
      });

      request.products = products;
      console.log("bambi-request: " + JSON.stringify(request));

      let responseOrderAtStore = await this.billService.orderAtStore(request);
      // alert(JSON.stringify(responseOrderAtStore));

    } catch (err) {
      console.log("bambi: " + err.toString());
      // this.alertAddFailed();
      alert(JSON.stringify(err));
    }
  }

  async orderOnline() {

    try {

      if (this.isPickAtStore) {
        this.shipMethod = "pick_at_store"
      } else {
        this.shipMethod = this.brand.brand_ship.ship_method;
      }

      let request = {
        "address": this.address,
        "longitude": this.longitude,
        "latitude": this.latitude,
        "sub_fee": this.globals.convertStringToPrice(this.subFee),
        "sub_fee_note": this.subFeeNote,
        "channel": this.channel,
        "pay_amount": this.globals.convertStringToPrice(this.payAmount),
        "receive_amount": this.globals.convertStringToPrice(this.receiveAmount),
        "branch_id": this.branchId,
        "employee_id": this.employeeId,
        "promotion_id": this.promotionId,
        "customer_id": this.customerId,
        "received_time": this.receivedTime,
        "is_vat": this.isVAT,
        "ship_method": this.shipMethod,
        "note": this.note,
        "receiver_name": this.receiverName,
        "receiver_phone": this.receiverPhone,
        "receiver_address": this.receiverAddress,
        "receiver_note": this.receiverNote,
        "payer_name": this.payerName,
        "payer_phone": this.payerPhone,
        "payer_address": this.payerAddress,
        "payer_note": this.payerNote,
        "products": [],
      }

      let products = [];
      this.selectedProduct.forEach(product => {
        let item = {
          product_id: product.id,
          amount: product.amount,
          topping_value_ids: []
        }
        let toppings = [];
        product.toppings.forEach(topping => {
          toppings.push(topping.id)
        });

        item.topping_value_ids = toppings;
        products.push(item);
      });

      request.products = products;
      console.log("bambi-request: " + JSON.stringify(request));

      let responseOrderAtStore = await this.billService.orderOnlineByEmployee(request);
      // alert(JSON.stringify(responseOrderAtStore));

    } catch (err) {
      console.log("bambi: " + err.toString());
      // this.alertAddFailed();
      alert(JSON.stringify(err));
    }
  }

  openUpdateReceiverInfoDialog() {
    let data = {
      title: "Thông tin người nhận",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      inputs: [
        {
          title: "Họ và tên",
          property: "receiverName",
          type: "text",
          current: this.receiverName,
        },
        {
          title: "Số điện thoại",
          property: "receiverPhone",
          type: "number",
          current: this.receiverPhone,
        },
        {
          title: "Địa chỉ",
          property: "receiverAddress",
          type: "text",
          current: this.receiverAddress,
        },
        {
          title: "Ghi chú",
          property: "receiverNote",
          type: "text",
          current: this.receiverNote,
        }
      ]
    };

    let dialogRef = this.dialog.open(EditInfoDialog, {
      width: '500px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.receiverName = result.receiverName ? result.receiverName : "";
        this.receiverPhone = result.receiverPhone ? result.receiverPhone : "";
        this.receiverAddress = result.receiverAddress ? result.receiverAddress : "";
        this.receiverNote = result.receiverNote ? result.receiverNote : "";
      }
    })
  }

  openUpdatePayerInfoDialog() {
    let data = {
      title: "Thông tin người trả tiền",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      inputs: [
        {
          title: "Họ và tên",
          property: "payerName",
          type: "text",
          current: this.payerName,
        },
        {
          title: "Số điện thoại",
          property: "payerPhone",
          type: "number",
          current: this.payerPhone,
        },
        {
          title: "Địa chỉ",
          property: "payerAddress",
          type: "text",
          current: this.payerAddress,
        },
        {
          title: "Ghi chú",
          property: "payerNote",
          type: "text",
          current: this.payerNote,
        }
      ]
    };

    let dialogRef = this.dialog.open(EditInfoDialog, {
      width: '500px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.payerName = result.payerName ? result.payerName : "";
        this.payerAddress = result.payerAddress ? result.payerAddress : "";
        this.payerPhone = result.payerPhone ? result.payerPhone : "";
        this.payerNote = result.payerNote ? result.payerNote : "";
      }
    })
  }
}


@Component({
  selector: 'topping-dialog',
  template: `
  <checkbox-topping-checklist [toppings]="selectedTopping"
  (updateSelectedTopping)="handleupdateSelectedTopping($event)"></checkbox-topping-checklist>
  <p class="header-text">Chi phí: {{totalPrice | accounting}}</p>
  <div style="text-align:center;margin:auto;width:100%;">
  <button type="button" class="btn btn-ladda btn-primary ml-auto" (click)="dialogRef.close(selectedToppings)">Chấp nhận</button>
  </div>`,
  styleUrls: ['./pos.component.scss'],
})
export class ToppingDialog {
  private _dimesionToggle = false;
  private selectedTopping: any;
  initialCount: number = 10;
  totalPrice: number = 0;
  selectedToppings: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ToppingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedTopping = data;
  }

  public setSelectedTopping(selectedTopping) {
    this.selectedTopping = selectedTopping;
  }

  handleupdateSelectedTopping(selectedToppings) {
    this.totalPrice = 0;
    this.selectedToppings = selectedToppings;
    this.selectedToppings.forEach(topping => {
      this.totalPrice += Number.parseInt(topping.price);
    });
    // this.addToppingsToProduct(result, )
  }

  togglePosition(): void {
    this._dimesionToggle = !this._dimesionToggle;

    if (this._dimesionToggle) {
      this.dialogRef
        .updateSize('500px', '500px')
        .updatePosition({ top: '25px', left: '25px' });
    } else {
      this.dialogRef
        .updateSize()
        .updatePosition();
    }
  }
}

@Component({
  selector: 'checkbox-topping-checklist',
  templateUrl: 'nested-checklist.html',
  styleUrls: ['./pos.component.scss'],
})
export class CheckboxToppingChecklistComponent implements OnInit {

  @Input()
  toppings: any[];

  totalPrice: number = 0;
  toppingsData: any[] = [];
  selectedToppings: any[] = [];

  @Output() updateSelectedTopping = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {

    this.toppings.forEach(data => {
      let task = {
        name: data.topping.name,
        completed: false,
        subtasks: [
        ]
      };
      data.topping.values.forEach(data => {
        let subtask = {
          id: data.id,
          name: data.name,
          price: data.price != null ? data.price : 0,
          completed: false,
        }
        task.subtasks.push(subtask);
      });
      this.toppingsData.push(task);
    });

  }

  allComplete(task: any): boolean {
    let subtasks = task.subtasks;

    if (!subtasks) {
      return false;
    }

    return subtasks.every(t => t.completed) ? true
      : subtasks.every(t => !t.completed) ? false
        : task.completed;
  }

  someComplete(tasks: any[]): boolean {
    const numComplete = tasks.filter(t => t.completed).length;
    return numComplete > 0 && numComplete < tasks.length;
  }

  setAllCompleted(tasks: any[], completed: boolean) {
    tasks.forEach(t => {
      this.updateStatus(t, completed);
    });
  }

  updateStatus(subtask, event) {
    subtask.completed = event;
    let pos = -1;
    for (var i = this.selectedToppings.length; i--;) {
      if (this.selectedToppings[i].name == subtask.name) {
        pos = i;
        break;
      }
    }

    if (pos != -1) {
      if (subtask.completed) {
        this.selectedToppings.push(subtask);
      } else {
        this.selectedToppings.splice(pos, 1);
      }
    } else {
      if (subtask.completed) {
        this.selectedToppings.push(subtask);
      }
    }

    this.updateSelectedTopping.emit(this.selectedToppings);
  }
}
