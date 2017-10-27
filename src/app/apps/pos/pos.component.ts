import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectorRef, NgZone, Inject, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash'
import { Globals } from "./../../globals";
import { InnowayService, AuthService } from "app/services";

import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { NgModel, FormControl, NgForm } from "@angular/forms";

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of'

import { DOCUMENT } from '@angular/platform-browser';

import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapsAPILoader } from "@agm/core";
import { SelectComponent } from "ng2-select";

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
  promotionData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  employeeService: any;
  branchService: any;
  categoryService: any;
  productService: any;
  customerService: any;
  brandService: any;

  subscriptions: any = {};

  productState: FormControl;
  autocompleteProduct: any;

  selectedProduct: Array<any> = new Array<any>();
  selectedTopping: Array<any> = new Array<any>();
  allProductData: Array<any> = new Array<any>();
  autocompleteCustomerData: Array<any> = new Array<any>();

  currentEmployee: any = {};
  isChose: boolean = false;

  private numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  employee: any;
  customer: string;
  transaction_time: string = "1";
  total_amount: string = "0";
  receive_amount: string = "0";
  pay_amount: string = "0";
  return_amount: string = "0";
  remain_amount: string = "0";
  shipFee: string = "0";
  deliveryTime: string;
  paid_type: string = "partical";

  channel: string;
  channels: any[];

  // channelOnline: string;
  // channelOnlines: any[] = [];

  deliveryMethod: string;
  deliveryMethods: any[] = [];

  isPickAtStore: boolean = false;
  isVAT: boolean = false;

  nameCustomerOnline: string;
  phoneCustomerOnline: string;
  addressOnline: string;
  shipFeeOnline: string;
  orderTimeOnline: string;
  totalAmountOnline: string = "0";
  payAmountOnline: string = "0";
  remainAmountOnline: string = "0";
  payTypeOnline: string;
  promotionOnline: string;
  promotionOnlines: string[];
  channelOnline: any;
  channelOnlines: any[];
  branchOnline: string;
  branchOnlines: string;
  deliveryMethodOnline: any;
  deliveryMethodOnlines: any[];
  noteOnline: string;


  nameCustomerAtStore: string;
  phoneCustomerAtStore: string;
  totalAmountAtStore: string = "0";
  receivedAmountAtStore: string = "0";
  payAmountAtStore: string = "0";
  returnAmountAtStore: string = "0";
  remainAmountAtStore: string = "0";
  payTypeAtStore: string;
  noteAtStore: string;
  promotionAtStore: any;
  promotionAtStores: any[];
  channelAtStore: any;
  channelAtStores: any[];

  code: string;
  promotion: string;
  branch: string;

  address: string;

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
    this.currentEmployee = this.auth.service.userInfo;

    console.log("bambi auth: " + JSON.stringify(this.currentEmployee));

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
  }

  openToppingDialog(data) {
    this.config.data = data;
    this.dialogRef = this.dialog.open(ToppingDialog, this.config);
    this.dialogRef.componentInstance.totalPrice = "0";

    this.dialogRef.beforeClose().subscribe((result: string) => {
      this.lastBeforeCloseResult = result;
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      alert(this.dialogRef.componentInstance.totalPrice);
      this.lastAfterClosedResult = result;
      this.dialogRef = null;
    });
  }

  async ngOnInit() {
    this.allProductData = await this.getProductData();
    this.employee = this.currentEmployee.fullname;
    this.getBrandData(this.currentEmployee.brand_id);
    this.getPromotionData();
    this.getBranchData();
    this.setAutocompleteMap();
  }

  async getBrandData(id: string) {
    try {
      let data = await this.brandService.get(id, {
        fields: ['$all', {
          'brand_ship': ['$all']
        }]
      })
      console.log("bambi brand: " + JSON.stringify(data));
      if (data.brand_ship != null) {
        if (data.brand_ship.allow_ship) {
          this.deliveryMethods.push(this.globals.DELIVERY_METHODS[0]);
        }
        if (data.brand_ship.allow_pick_at_store) {
          this.deliveryMethods.push(this.globals.DELIVERY_METHODS[1]);
        }
        this.deliveryMethod = this.deliveryMethods[0].code;
        this.ref.detectChanges();
      }
    } catch (err) {
      this.alertItemNotFound()
    }
  }

  async getBranchData() {
    try {
      let data = await this.innoway.getAll('branch', {
        fields: ["$all"]
      });
      this.branchData = data;
      this.branch = data._value[0].id;
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async getPromotionData() {
    try {
      let data = await this.innoway.getAll('promotion', {
        fields: ["$all"]
      });
      this.promotionData = data;
      this.promotion = data._value[0].code;
      console.log("bambi promotion: " + JSON.stringify(data));
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

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
        this.openToppingDialog(data.toppings);
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
    }

    if (isAvaible) {
      this.selectedProduct[pos] = item;
    } else {
      this.selectedProduct.push(item);
    }

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
    this.total_amount = total.toString();
    this.ref.detectChanges();
  }

  private calculateRemainAndReturnAmount(event) {
    let totalAmount = this.globals.convertStringToPrice(this.total_amount);
    let receiveAmount = this.globals.convertStringToPrice(this.receive_amount);
    let payAmount = this.globals.convertStringToPrice(this.pay_amount);
    this.remain_amount = (totalAmount - payAmount).toString();
    this.return_amount = (receiveAmount - payAmount).toString();
    if (totalAmount == payAmount) {
      this.paid_type = this.globals.PAID_HISTORY_TYPES[1].name;
    } else {
      this.paid_type = this.globals.PAID_HISTORY_TYPES[0].name;
    }
    this.ref.detectChanges();
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
            return;
          }

          this.address = place.formatted_address;
          this.ref.detectChanges();
        });
      });
    });
  }

  public selected(value: any): void {
    console.log('Selected value is: ' + value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ' + value);
  }

  public refreshValue(value: any): void {
    // this.value = value;
    console.log("bambi customer 2: " + JSON.stringify(value));
  }

  @ViewChild('customerSelect') select: SelectComponent;

  addToItems() {
    this.autocompleteCustomerData.push({ id: "", text: this.newItem });
    this.select.items = this.autocompleteCustomerData;
    this.select.active = [{ id: "4", text: this.newItem }];
    this.ref.detectChanges();
    // this.select.item.ngOnInit();
  }

  newItem: string = '';

  public onChangeCustomer(event) {
    this.newItem = event;
    console.log("bambi customer: " + JSON.stringify(event));
  }

  public test(event) {
    console.log("bambi customer 1: " + JSON.stringify(event));
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }

  async detectChangeSelect(event) {
    console.log("bambi bambi: " + JSON.stringify(event));
    const customerService = this.innoway.getService('customer');
    let limit = 5;
    this.customerData = await customerService.getAllWithQuery({
      fields: ["$all"],
      limit: limit,
      filter: {
        phone: { $iLike: `%${event}%` }
      }
    })

    this.autocompleteCustomerData = new Array<any>();

    this.customerData.forEach(data => {
      let item: any = data;
      let imp = {
        text: item.phone,
        id: item.phone
      };
      this.autocompleteCustomerData.push(imp);
    })
  }

  orderAtStore() {

  }

  async orderOnline(form: NgForm) {
    if (form.valid) {
      let { addressOnline } = this;
      let address;
      let phone;

      // await this.brandService.add({ name, color, logo, trail_expire, status })
      // this.alertAddSuccess();
      // form.reset();
      // form.resetForm(this.setDefaultData);
    } else {
      this.alertFormNotValid();
    }
  }
}


@Component({
  selector: 'topping-dialog',
  template: `
  <checkbox-topping-checklist [toppings]="selectedTopping"
  (updateSelectedTopping)="handleupdateSelectedTopping($event)"></checkbox-topping-checklist>
  <p>{{totalPrice}}</p>
  <button type="button" (click)="dialogRef.close(howMuch.value)">Close dialog</button>
  <button (click)="togglePosition()">Change dimensions</button>`
})
export class ToppingDialog {
  private _dimesionToggle = false;
  private selectedTopping: any;
  initialCount: number = 10;
  totalPrice: string;
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
    this.selectedToppings = selectedToppings;
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
  styles: [`
    li {
      margin-bottom: 4px;
    }
  `],
  templateUrl: 'nested-checklist.html',
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
      t.completed = completed;
    });
  }

  updateStatus(subtask, event) {
    for (var i = this.selectedToppings.length; i--;) {
      if (this.selectedToppings[i].name === subtask.name) {
        if (!subtask.completed) {
          this.selectedToppings.splice(i, 1);
        } else {
          this.selectedToppings.push(subtask);
        }
        break;
      }
    }

    this.updateSelectedTopping.emit(subtask);
  }
}
