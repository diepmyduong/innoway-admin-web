import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from 'app/services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router, ActivatedRoute } from "@angular/router";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../Globals"

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

  promotionService: any;
  customerTypeService: any;
  promotionTypeService: any;
  customerTypePromotionService: any;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/];

  name: string;
  amount: number = 0;
  code: string;
  limit: number = 0;
  public description;
  shortDescription: string;
  startDate: string;
  endDate: string;
  value: number = 0;
  customerType: string;
  promotionType: string;
  status: number = 1;
  customerTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  promotionTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.promotionService = innoway.getService('promotion');
    this.customerTypeService = innoway.getService('customer_type');
    this.promotionTypeService = innoway.getService('promotion_type');
    this.customerTypePromotionService = innoway.getService('customer_type_promotion');
  }

  changeText(event) {
    console.log("bambi change text: " + JSON.stringify(event));
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    await this.loadPromotionTypeData();
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
    this.description = '';
    this.shortDescription = "";
    if (this.promotionTypeData.getValue()[0]) {
      this.promotionType = this.promotionTypeData.getValue()[0].id;
    }
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
      shortDescription: this.shortDescription
    }
  }

  async setData() {
    try {
      let data = await this.promotionService.get(this.id, {
        fields: ["$all", {
          promotion_type: ["id", "name"], customer_types: ["$all"]
        }]
      });
      console.log(JSON.stringify(data));
      this.name = data.name
      this.amount = data.amount
      this.code = data.code
      this.limit = data.limit
      this.description = data.description
      this.shortDescription = data.short_description
      this.startDate = data.start_date
      this.endDate = data.end_date
      this.value = data.value
      this.customerType = data.customer_types.id
      this.promotionType = data.promotion_type.id
      this.status = data.status

    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadPromotionTypeData() {
    try {
      this.promotionTypeData = await this.innoway.getAll('promotion_type', {
        fields: ["id", "name"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadCustomerTypeData() {
    try {
      this.customerTypeData = await this.innoway.getAll('customer_type', {
        fields: ["id", "name"]
      });
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  backToList() {
    this.router.navigate(['../list'], { relativeTo: this.route });
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
      && start > now && start <= end) {
      result = true;
    }
    return result;
  }

  async addItem(form: NgForm) {
    if (form.valid && this.detectDate(this.startDate, this.endDate)) {
      let { name, amount, code, limit, shortDescription, description, value, status } = this;
      let start_date = new Date(this.startDate);
      let short_description = shortDescription;
      let end_date = new Date(this.endDate);
      let customer_type_id = this.customerType;
      let promotion_type_id = this.promotionType;
      let promotion = await this.promotionService.add({ name, amount, code, limit, short_description, description, start_date, end_date, value, promotion_type_id, status })

      let customer_type_ids: string[] = [];
      customer_type_ids.push(customer_type_id);
      await this.promotionService.addCustomerTypes(promotion.id, customer_type_ids);

      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      // alert(form.valid + " ---- " + this.detectDate(this.startDate, this.endDate));
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid && this.detectDate(this.startDate, this.endDate)) {
      let { name, amount, code, limit, shortDescription, description, value, status } = this;
      let start_date = new Date(this.startDate);
      let short_description = shortDescription;
      let end_date = new Date(this.endDate);
      let customer_type_id = this.customerType;
      let promotion_type_id = this.promotionType;
      await this.promotionService.add({ name, amount, code, limit, short_description, description, start_date, end_date, value, customer_type_id, promotion_type_id, status })
      this.alertUpdateSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
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
      this.backToList();
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
    await this.promotionService.sendPromotionToMessenger(this.id, "BCSBCS");
  }

}
