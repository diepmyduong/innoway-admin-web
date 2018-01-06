import {
  Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectorRef,
  NgZone, Inject, TemplateRef, Input, Output, EventEmitter
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
import * as moment from 'moment';
import { Globals } from "./../../globals";
import { InnowayApiService } from "app/services/innoway";

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

import { ToppingDialog } from "./topping-dialog.component"
import { EditInfoDialog } from "../../modal/edit-info/edit-info.component";
import { DataTable } from "angular-2-data-table-bootstrap4";

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

  subscriptions: any = {};

  productState: FormControl;
  autocompleteProduct: any;

  customerPhoneOnline: string = "";
  customerNameOnline: string = "";
  customerNamePlaceholder: string = "Khách vãng lai";
  customerPhoneAtStore: string = "";
  customerNameAtStore: string = "";

  selectedProducts: Array<any> = new Array<any>();
  selectedTopping: Array<any> = new Array<any>();
  allProductData: Array<any> = new Array<any>();
  autocompleteCustomerData: Array<any> = new Array<any>();
  autocompleteCustomerNameData: Array<any> = new Array<any>();

  isChose: boolean = false;

  private numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  @ViewChild("addressInput") addressElementRef: ElementRef;

  dialogRef: MatDialogRef<ToppingDialog> | null;
  actionsAlignment: string;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', '2', '0', '1', '8', ' ', /\d/, /\d/, ':', /\d/, /\d/];

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
    data: {
      selectedToppings: [],
      productToppings: [],
    }
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
  branchDataName: string = null;

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
  selectedBranch: any = null;
  employee: any;
  customer: any;

  address: string;
  subFee: string = "0";
  subFeeNote: string;

  shipFee: string = "0";
  addressValidated: boolean = true;
  deliveryTime: any;
  paidType: string = "partial";

  channel: string;
  channels: any[];

  deliveryMethod: string;
  deliveryMethods: any[] = [];

  maxSize: number = 5;
  currentPage: number = 1;
  totalItems: number;

  category_filter = "all";
  name_filter: any;

  isQueryingProduct: boolean = false;
  isDetectingNameFromPhone: boolean = false;
  isCalculatingShipFee: boolean = false;
  isCreatingOrder: boolean = false;

  methodModel = 'store';

  isVAT: boolean = false;
  isPickAtStore: boolean;
  vatValue: number;

  @ViewChild(TemplateRef) template: TemplateRef<any>;
  @ViewChild('itemsTable') itemsTable: DataTable;

  constructor(public innowayApi: InnowayApiService,
    private globals: Globals,
    private ref: ChangeDetectorRef,
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

    this.employee = this.innowayApi.innowayAuth.innowayUser;

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

    this.deliveryTime = moment().format('MM/DD/yyyy HH:mm');
  }

  checkVAT(event) {
    this.isVAT = event;
    this.updateTotalAmount();
  }

  updateDeliveryTime(event) {
    // this.deliveryTime = new Date(event);
    //console.log((new Date(event)).toString());
  }

  async ngOnInit() {
    this.allProductData = await this.filterProduct();
    await this.getCategoriesData();
    // this.employee = this.employee.fullname;
    this.employeeId = this.employee.id;
    this.employeeName = this.employee.fullname;

    //console.log("bambi auth: " + JSON.stringify(this.employee));

    this.getBrandData(this.employee.brand_id);
    // this.getPromotionData();
    this.getAllBranchData();
    this.getBranchData(this.employee.branch_id);
    this.setAutocompleteMap();
  }

  async getCategoriesData() {
    try {
      let data = await this.innowayApi.productCategory.getList({
        query: { fields: ["$all"] }
      })
      this.categoryData.next(data);
    } catch (err) {
      this.alertItemNotFound()
    }
  }

  async getBrandData(id: string) {
    try {
      let data = await this.innowayApi.brand.getItem(id, {
        query: {
          fields: ['$all', {
            'brand_ship': ['$all']
          }]
        }
      })
      this.brand = data;
      this.vatValue = data.vat_value == null || data.vat_value == 0 ? 1 : data.vat_value;
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
    try {
      let data = await this.innowayApi.branch.getItem(id, {
        query: { fields: ["$all", "$paranoid"] }
      })
      this.branch = data;
      this.branchId = this.branch.id;
      this.branchName = this.branch.name;
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async getAllBranchData() {
    try {
      this.branchData.next(await this.innowayApi.branch.getList({
        query: {
          fields: ["$all"],
          limit: 0,
        }
      }))
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async onFilterChange() {
    this.allProductData = await this.filterProduct();
  }

  async filterProduct() {
    let query = {
      fields: ["$all", {
        toppings: ["id", {
          topping: ["$all", {
            values: ["id", "name", "price"]
          }]
        }]
      }],
      limit: 10,
      filter: {},
      page: this.currentPage,
    }

    if (this.category_filter != "all") {
      query.filter = { ...query.filter, category_id: this.category_filter }
    }

    if (this.name_filter) {
      query.filter = { ...query.filter, name: { $iLike: `%${this.name_filter}%` } }
    }

    try {
      this.isQueryingProduct = true;
      let list = await this.innowayApi.product.getList({
        query: query
      });
      this.totalItems = this.innowayApi.product.pagination.totalItems;
      this.productData.next(list);
      this.isQueryingProduct = false;
      return this.productData.getValue()
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      this.isQueryingProduct = false;
    }
  }

  async getToppings(product, rowIndex) {
    let productId = product.id;
    let productToppings = product.toppings ? [...product.toppings] : [];
    let selectedToppings;
    if (product.selectedToppings) {
      selectedToppings = _.cloneDeep(product.selectedToppings);
    } else {
      selectedToppings = [];
    }
    console.log(selectedToppings)
    try {
      this.openToppingDialog(productId, rowIndex, productToppings, selectedToppings);
    } catch (err) {
      await this.alertItemNotFound()
      console.log("ERRRR", err);
    }
  }

  openToppingDialog(productId, rowIndex, productToppings, selectedToppings) {
    this.config.data.productToppings = productToppings;
    this.config.data.selectedToppings = selectedToppings;
    this.dialogRef = this.dialog.open(ToppingDialog, this.config);

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        this.addToppingsToProduct(result.data, productId, rowIndex);
      }
      this.dialogRef = null;
    });
  }

  addToppingsToProduct(selectedToppings: any, id: string, rowIndex) {
    let product = this.selectedProducts[rowIndex];
    product.selectedToppings = selectedToppings;
    product.pure = false;

    // let topping_value_ids = [];
    // selectedToppings.forEach(value => {
    //   topping_value_ids.push(value.option.id);
    // });
    // product.topping_value_ids = topping_value_ids;
    // console.log(topping_value_ids);

    let total = 0;
    product.selectedToppings.forEach((item, index) => {
      total += Number.parseInt(item.option.price);
    });

    let priceWithTopping = Number.parseInt(product.price) + total;
    product.priceWithTopping = priceWithTopping.toString();
    product.total = (priceWithTopping * Number.parseInt(product.amount)).toString();
    this.selectedProducts[rowIndex] = product;

    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  addProduct(product) {
    let amount = 0;
    let price = Number.parseFloat(product.price);
    let pos = -1;

    for (let i = 0; i < this.selectedProducts.length; i++) {
      let item = this.selectedProducts[i];
      if (item.id == product.id && item.pure) {
        pos = i;
        break;
      }
    }

    if (pos > -1) {
      this.updateAmount(this.selectedProducts[pos], this.selectedProducts[pos].amount + 1, pos);
      return;
    }

    product.selectedToppings = [];
    product.toppings.forEach(item => {
      let topping = item.topping;
      if (topping.is_select_multiple == false) {
        for (let i = 0; i < topping.values.length; i++) {
          let option = topping.values[i];
          if (option.price == 0) {
            product.selectedToppings.push({ option: option, topping_id: topping.id, type: 'single' });
            return;
          }
        }
      }
    })

    amount = 1;
    let total = price * amount;

    let item = {
      id: product.id,
      name: product.name,
      amount: amount,
      thumb: product.thumb,
      price: price,
      priceWithTopping: price,
      total: total.toString(),
      toppings: product.toppings,
      selectedToppings: product.selectedToppings,
      pure: true,
    }

    this.selectedProducts.push(item);

    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  removeProduct(product,index) {
    this.selectedProducts.splice(index, 1);
    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  removeAllProduct() {
    this.selectedProducts = new Array<any>();
    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      allowOutsideClick: false,
    })
  }

  alertAddSuccess() {
    return swal({
      title: 'Cập nhật thành công',
      type: 'success',
      allowOutsideClick: false,
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      allowOutsideClick: false,
    })
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
      allowOutsideClick: false,
    })
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
      allowOutsideClick: false,
    })
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
      allowOutsideClick: false,
    })
  }

  private _filter(states: State[], val: string) {
    const filterValue = val.toLowerCase();
    return states.filter(state => state.name.toLowerCase().startsWith(filterValue));
  }

  async searchProduct(key: string) {
    let limit = 5;
    if (key == null || key == "" || this.isChose) {
      this.isChose = false;
      return this.productData.next(this.allProductData);
    } else {
      return await this.innowayApi.product.getList({
        query: {
          fields: ["$all"],
          limit: limit,
          filter: {
            name: { $iLike: `%${key}%` }
          }
        }
      })
    }
  }

  updateAmount(product, amount, rowIndex) {
    let pos = rowIndex;

    let total = Number.parseInt(amount) * Number.parseInt(product.priceWithTopping);

    this.selectedProducts[pos].amount = amount;
    this.selectedProducts[pos].total = total;

    this.updateTotalAmount();
    this.ref.detectChanges();
  }

  updateTotalAmount() {
    let total = 0;
    this.selectedProducts.forEach(item => {
      total += Number.parseInt(item.total);
    })
    // this.totalAmount = total.toString();
    this.outputAmountOfPriceItems = total;
    if (this.isVAT == true) {
      this.outputVAT = (this.outputAmountOfPriceItems + this.outputSubFee) * this.vatValue;
    } else {
      this.outputVAT = 0;
    }
    this.calculateAmountOfPurchase();
    this.ref.detectChanges();
  }

  updateOutputSubFee(event) {
    // alert(JSON.stringify(event));
    this.outputSubFee = this.globals.convertStringToPrice(event);
  }

  fillFullPayAmount() {
    this.receiveAmount = this.totalAmount;
    this.payAmount = this.totalAmount;
    this.calculateRemainAndReturnAmount();
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
      let autocomplete = new google.maps.places.Autocomplete(this.addressElementRef.nativeElement, {
        types: ["address"],
        componentRestrictions: { country: 'vn' }
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
      this.isCalculatingShipFee = true;
      let data = {
        "longitude": longitude,
        "latitude": latitude
      }
      let fee = await this.innowayApi.bill.calculateShipFee(data);
      this.shipFee = fee.fee;
      if (this.methodModel == 'online') {
        this.outputShipFee = Number.parseInt(this.shipFee);
      } else {
        this.outputShipFee = 0;
      }
      this.isCalculatingShipFee = false;
      this.addressValidated = true;
      this.ref.detectChanges();
      this.updateTotalAmount();
    } catch (err) {
      this.isCalculatingShipFee = false;
      this.addressValidated = false;
      this.ref.detectChanges();
    }
  }

  async detectCustomerByPhone(phone: string) {
    if (!this.customerPhoneAtStore) {
      this.customer = null;
      this.customerId = null;
      this.customerNameAtStore = "";
      this.customerNamePlaceholder = "Khách vãng lai";
      return;
    }

    if (phone.startsWith('0')) {
      phone = phone.substr(1);
    }
    phone = '+84' + phone;

    try {
      this.isDetectingNameFromPhone = true;
      let data = {
        phone: phone.toString()
      }
      this.customer = await this.innowayApi.customer.getCustomerByPhone(data);

      this.promotion = null;
      if (this.customer != null && this.customer.code != 500) {
        if (this.customer.fullname) {
          this.customerNameAtStore = this.customer.fullname
        }
        else {
          this.customerNameAtStore = "";
          this.customerNamePlaceholder = "Khách hàng chưa có tên";
        }
        this.getPromotionsByCustomerId(this.customer.id);
        this.customerId = this.customer.id;
      } else {
        this.customerId = null;
      }

      if (!this.customerPhoneAtStore) {
        this.customerNameAtStore = "";
        this.customer = null;
        this.customerId = null;
        this.customerNamePlaceholder = "Khách vãng lai";
        return;
      }

      this.isDetectingNameFromPhone = false;
    } catch (err) {
      this.customerNameAtStore = null;
      this.customer = null;
      this.customerId = null;
      this.isDetectingNameFromPhone = false;

      this.customerNamePlaceholder = "Chưa có tài khoản";

      if (!this.customerPhoneAtStore) {
        this.customerNameAtStore = "";
        this.customer = null;
        this.customerId = null;
        this.customerNamePlaceholder = "Khách vãng lai";
        return;
      }
    }
  }

  async getPromotionsByCustomerId(customerId) {
    try {
      let data = await this.innowayApi.customer.getPromotions(customerId, {
        query: { fields: ["$all"] }
      })
      this.promotionData = data;
      this.ref.detectChanges();
      // alert(JSON.stringify(data))
    } catch (err) {
      console.log(err.message)
    }
  }

  checkMethod() {
    if (this.isCreatingOrder) {
      return;
    } else {
      (this.methodModel == 'store') ? this.methodModel = 'online' : this.methodModel = 'store';
    }

    if (this.methodModel == 'store') {
      this.selectBillAtStoreTab();
    }
    else {
      this.selectBillOnlineTab();
    }
  }

  selectCustomerPromotion(event) {
    this.promotionId = event;
    this.updateTotalAmount();
  }

  selectBillAtStoreTab() {
    this.outputShipFee = 0;
    this.updateTotalAmount();
  }

  selectBillOnlineTab() {
    this.outputShipFee = this.shipFee ? Number.parseInt(this.shipFee) : 0;
    this.updateTotalAmount();
  }

  async addOrder() {
    if (!this.selectedProducts || this.selectedProducts.length == 0) {
      swal ("Lỗi nhập liệu", "Không được để trống đơn hàng.", "warning");
      return;
    }

    if (this.customerNameAtStore && !this.customerPhoneAtStore) {
      swal ("Lỗi nhập liệu", "Không được để trống SĐT khi đã nhập tên khách hàng.", "warning");
      return;
    }

    if (this.methodModel == 'online' && (!this.address || this.isCalculatingShipFee || !this.addressValidated)) {
      swal ("Lỗi địa chỉ", "Địa chỉ giao hàng chưa có hoặc không hỗ trợ.", "warning");
      return;
    }

    this.isCreatingOrder = true;

    // Create new account
    if (this.customerId == null) {
      if (this.customerPhoneAtStore) {
        try {
          let phone;
          if (this.customerPhoneAtStore.startsWith('0')) {
            phone = this.customerPhoneAtStore.substr(1);
          }
          else {
            phone = this.customerPhoneAtStore
          }
          this.customer = await this.innowayApi.customer.add({ fullname: this.customerNameAtStore, phone: '+84' + this.customerPhoneAtStore,});
          this.customerId = this.customer.id;
        } catch (err) {
          swal('Lỗi tạo khách hàng', 'Không tạo được khách hàng', 'error');
          console.log(err.message);
          this.isCreatingOrder = false;
          return;
        }
      }
    } else {
      if (!this.customer.fullname && this.customerNameAtStore) {
        try {
          await this.innowayApi.customer.update(this.customerId, { fullname: this.customerNameAtStore });
        } catch (err) {
          swal('Lỗi cập nhật', 'Không cập nhật được tên khách hàng', 'error');
          this.isCreatingOrder = false;
          return;
        }
      }
    }

    if (this.methodModel == 'store') {
      this.orderAtStore();
    } else {
      this.orderOnline();
    }
  }

  async orderAtStore() {
    try {

      this.address = this.branch.address;
      this.longitude = this.branch.longitude;
      this.latitude = this.branch.latitude;

      let request = {
        "address": this.address,
        "longitude": _.toNumber(this.longitude),
        "latitude": _.toNumber(this.latitude),
        "sub_fee": this.globals.convertStringToPrice(this.subFee),
        "sub_fee_note": this.subFeeNote,
        "channel": this.channel,
        "is_vat": this.isVAT,
        "pay_amount": this.globals.convertStringToPrice(this.payAmount),
        "receive_amount": this.globals.convertStringToPrice(this.receiveAmount),
        "branch_id": this.branchId,
        "employee_id": this.employeeId,
        "note": this.note,
        "promotion_id": this.promotionId ? this.promotionId : undefined,
        "customer_id": this.customerId ? this.customerId : undefined,
        "products": []
      }

      let products = [];
      this.selectedProducts.forEach(product => {
        let item = {
          product_id: product.id,
          amount: parseInt(product.amount),
          topping_value_ids: []
        }
        product.selectedToppings.forEach(topping => {
          item.topping_value_ids.push(topping.option.id)
        });

        products.push(item);
      });

      request.products = products;
      console.log("bambi-request: " + JSON.stringify(request));

      let responseOrderAtStore = await this.innowayApi.bill.orderAtStore(request);
      // alert(JSON.stringify(responseOrderAtStore));
      this.resetDefaultValue();

      this.alertAddSuccess();
      this.isCreatingOrder = false;
    } catch (err) {
      console.log("bambi: " + err.toString());
      this.alertAddFailed();
      this.isCreatingOrder = false;
      // alert(JSON.stringify(err));
    }
  }

  async orderOnline() {

    try {

      if (this.isPickAtStore) {
        this.shipMethod = "pick_at_store"
      } else {
        this.shipMethod = this.brand.brand_ship.ship_method;
      }

      let receivedMoment = moment(this.deliveryTime, "MM/DD/yyyy HH:mm");
      if (!this.deliveryTime || !receivedMoment.isAfter(moment())) {
        this.receivedTime == null;
      }
      else {
        this.receivedTime = receivedMoment.format();
      }

      let request = {
        "address": this.address,
        "longitude": _.toNumber(this.longitude),
        "latitude": _.toNumber(this.latitude),
        "sub_fee": this.globals.convertStringToPrice(this.subFee),
        "sub_fee_note": this.subFeeNote,
        "channel": this.channelOnline,
        "pay_amount": this.globals.convertStringToPrice(this.payAmount),
        "receive_amount": this.globals.convertStringToPrice(this.receiveAmount),
        "branch_id": this.branchId,
        "employee_id": this.employeeId,
        "promotion_id": this.promotionId ? this.promotionId : undefined,
        "customer_id": this.customerId ? this.customerId : undefined,
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
      this.selectedProducts.forEach(product => {
        let item = {
          product_id: product.id,
          amount: product.amount,
          topping_value_ids: []
        }
        product.selectedToppings.forEach(topping => {
          item.topping_value_ids.push(topping.option.id)
        });

        products.push(item);
      });

      request.products = products;
      console.log("bambi-request: " + JSON.stringify(request));

      let responseOrderAtStore = await this.innowayApi.bill.orderOnlineByEmployee(request);
      // alert(JSON.stringify(responseOrderAtStore));
      this.resetDefaultValue();
      this.alertAddSuccess()
      this.isCreatingOrder = false;
    } catch (err) {
      console.log("bambi: " + err.toString());
      this.alertAddFailed();
      this.isCreatingOrder = false;
      // alert(JSON.stringify(err));
    }
  }

  resetDefaultValue() {
    this.selectedProducts = [];
    this.promotion = null;
    this.address = null;
    this.longitude = null;
    this.latitude = null;
    this.customer = null;

    this.outputVAT = 0;
    this.outputSubFee = 0;
    this.outputShipFee = 0;
    this.outputPromotion = 0;
    this.outputAmountOfPurchase = 0;
    this.outputAmountOfPriceItems = 0;

    this.shipFee = "0";
    this.receiveAmount = "0";
    this.payAmount = "0";
    this.returnAmount = "0";
    this.remainAmount = "0";
    this.paidType = this.globals.PAID_HISTORY_TYPES[0].code;

    this.receivedTime = "0";
    
    this.receiverName = "",
    this.receiverPhone = "",
    this.receiverAddress = "",
    this.receiverNote = "",
    this.payerName = "",
    this.payerPhone = "",
    this.payerAddress = "",
    this.payerNote = "",
    
    this.customerPhoneAtStore = "";
    this.customerNamePlaceholder = "Khách vãng lai";
    this.customerNameAtStore = "";
    this.customer = null;
    this.customerId = null;
    this.promotion = null;

    this.isVAT = false;
    this.calculateAmountOfPurchase();

    this.ref.detectChanges();
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