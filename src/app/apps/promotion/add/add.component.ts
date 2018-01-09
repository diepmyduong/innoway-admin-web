import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomValidators } from "ng2-validation/dist";
import { InnowayApiService } from 'app/services/innoway'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router, ActivatedRoute } from "@angular/router";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../Globals"
import * as moment from 'moment';

declare let accounting: any;
declare let swal: any;
// declare var $: any;

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/];

  name: string;
  amount: number = 0;
  code: string;
  limit: number = 0;
  image: string;
  public description;
  shortDescription: string;
  startDate: string;
  endDate: string;
  value: number = 0;
  customerType: string;

  promotionType: 'discount_by_percent' | 'discount_by_price' | 'discount_by_gift';
  promotionTypes: any[];

  promotion: string;
  promotions: any[];

  status: number = 1;
  customerTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // promotionTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innowayApi: InnowayApiService) {

    this.promotionTypes = this.globals.PROMOTION_TYPES;
    this.promotionType = this.promotionTypes[0].code;
  }

  changeText(event) {
    console.log("bambi change text: " + JSON.stringify(event));
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    await this.loadCustomerTypeData();

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
    this.startDate = null;
    this.startDate = null;
    this.value = 0;
    this.limit = 0
    this.amount = 0;
    this.code = null;
    this.description = "";
    this.shortDescription = "";
    this.image = "";
    this.promotionType = this.promotionTypes[0].code;
    if (this.customerTypeData.getValue()[0]) {
      this.customerType = this.customerTypeData.getValue()[0].id;
    }
    return {
      status: this.status,
      promotionType: this.promotionType,
      customerType: this.customerType,
      startDate: this.startDate,
      endDate: this.endDate,
      value: this.value,
      limit: this.limit,
      amount: this.amount,
      code: this.code,
      description: this.description,
      shortDescription: this.shortDescription,
      image: this.image
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.promotion.getItem(this.id, {
        query: {
          fields: ["$all", {
            customer_types: ["$all"]
          }]
        }
      })
      this.name = data.name
      this.amount = data.amount
      this.code = data.code
      this.limit = data.limit
      this.description = data.description
      this.shortDescription = data.short_description
      this.startDate = moment(data.start_date).format("MM/DD/YYYY hh:mm")
      this.endDate = moment(data.end_date).format("MM/DD/YYYY hh:mm")
      this.value = data.value
      this.customerType = data.customer_types[0].customer_type_id
      this.promotionType = data.promotion_type
      this.status = data.status
      this.image = data.image

    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadPromotions() {
    try {
      this.promotions = await this.innowayApi.promotion.getList({
        query: {
          fields: ["$all"]
        }
      })
    } catch (err) {

    }
  }

  async loadCustomerTypeData() {
    try {
      this.customerTypeData.next(await this.innowayApi.customerType.getList({
        query: { fields: ["id", "name"] }
      }))
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
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

  detectDate(startDate: string, endDate: string): boolean {
    let result = false;
    let start = new Date(startDate);
    let end = new Date(endDate);
    let now = new Date(Date.now());
    if (start.toString().toLowerCase().indexOf("invalid") == -1
      && end.toString().toLowerCase().indexOf("invalid") == -1
      && end >= now && start <= end) {
      result = true;
    }
    return result;
  }

  async addItem(form: NgForm) {
    // alert(this.startDate)
    // alert(moment(this.startDate, "MM/DD/YYYY hh:mm").format())
    // alert(new Date(this.startDate).toString()+"\n"+new Date(this.endDate).toString());
    if (form.valid && this.detectDate(this.startDate, this.endDate)
      && ((this.promotionType == this.globals.PROMOTION_TYPES[1].code && this.value <= 100 && this.value > 0)
        || (this.promotionType == this.globals.PROMOTION_TYPES[0].code) && this.value > 0)) {
      let { name, amount, code, limit, shortDescription, description, value, status, image } = this;
      let start_date = moment(this.startDate, "MM/DD/YYYY hh:mm").format();
      let short_description = shortDescription;
      let end_date = moment(this.endDate, "MM/DD/YYYY hh:mm").format();
      let customer_type_id = this.customerType;
      let promotion_type = this.promotionType;
      let promotion = await this.innowayApi.promotion.add({
        name, amount, code, limit, short_description,
        description, start_date: new Date(start_date), end_date: new Date(end_date), value, promotion_type, status, image
      })

      let customer_type_ids: string[] = [];
      customer_type_ids.push(customer_type_id);
      await this.innowayApi.promotion.addCustomerTypes(promotion.id, customer_type_ids);

      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid && this.detectDate(this.startDate, this.endDate)
      && ((this.promotionType == this.globals.PROMOTION_TYPES[1].code && this.value <= 100 && this.value > 0)
        || (this.promotionType == this.globals.PROMOTION_TYPES[0].code) && this.value > 0)) {
      let { name, amount, code, limit, shortDescription, description, value, status, image } = this;
      let start_date = moment(this.startDate, "MM/DD/YYYY hh:mm").format();
      let short_description = shortDescription;
      let end_date = moment(this.endDate, "MM/DD/YYYY hh:mm").format();
      let customer_type_id = this.customerType;
      let promotion_type = this.promotionType;
      let promotion = await this.innowayApi.promotion.update(this.id, {
        name, amount, code, limit, short_description,
        description, start_date: new Date(start_date), end_date: new Date(end_date), value, customer_type_id, promotion_type, status, image
      })

      let customer_type_ids: string[] = [];
      customer_type_ids.push(customer_type_id);
      await this.innowayApi.promotion.updateCustomerType(promotion.id, customer_type_ids);

      this.alertUpdateSuccess();
      form.reset();
      this.backToList();
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
      console.log("ERROR SUBMIT", err);
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

  async send() {
    let customer_type_ids: string[] = [];
    // alert(JSON.stringify(this.customerType));
    // customer_type_ids.push(this.customerType);
    await this.innowayApi.promotion.sendPromotionToMessenger(this.id, "BCSBCS");
  }


}
