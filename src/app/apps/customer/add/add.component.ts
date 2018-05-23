import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService, iCustomer } from "app/services/innoway";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../globals";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as _ from 'lodash'
declare let swal: any

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

  name: string;
  avatar: string;
  birthday: string;
  email: string;
  fullname: string;
  password: string;
  phone: string;
  sex: string = null;
  genders: any[];
  status: number = 1;
  trustPoint: number = 3;

  isExisted: boolean = false;
  isValidPhone: boolean = false;
  currentPhone: string;

  username: string

  company: string = null
  companies: any[] = [
    {
      code: "MCOM",
      name: "MCOM"
    },
    {
      code: "UGIFT",
      name: "Ugift"
    },
    {
      code: "PRUDENTIAL",
      name: "Prudential"
    }
  ]

  prudCustomerType: string = null
  prudCustomerTypes: any[] = [
    {
      code: "AGENT",
      name: "Tư vấn viên"
    }, {
      code: "GAD",
      name: "Đại lý"
    }, {
      code: "DEPARTMENT",
      name: "Phòng ban"
    },
  ]

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innowayApi: InnowayApiService) {
    this.genders = this.globals.GENDERS;
  }

  async ngOnInit() {
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
  }

  setDefaultData() {
    this.status = 1;
    this.trustPoint = 3;
    this.sex = null;

    return {
      status: this.status,
      trustPoint: this.trustPoint,
      sex: this.sex
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.customer.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.avatar = data.avatar
      this.birthday = _.toString(data.birthday)
      this.email = data.email
      this.fullname = data.fullname
      this.password = data.password
      this.phone = data.phone.toString()
      if (this.phone) {
        this.getTokenCustomer(this.phone)
      }
      this.currentPhone = data.phone
      this.sex = data.sex ? data.sex.toString() : null
      this.status = data.status
      this.trustPoint = data.trust_point ? data.trust_point : 3
      this.isValidPhone = true

      this.prudCustomerType = data.account_type
      this.username = data.username
      this.password = data.password
      this.company = data.account_type ? "PRUDENTIAL" : "UGIFT"
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      this.backToList()
    }
  }

  async getTokenCustomer(phone: string) {
    try {
      let response = await this.innowayApi.authCustomer.getCustomerTokenByPhone({
        phone: phone
      })
      console.log("getTokenCustomer", JSON.stringify(response))

      this.getPaymentMethod(response.results.object.access_token)
    } catch (err) {

    }
  }

  async getPaymentMethod(token: string) {
    try {
      let response = await this.innowayApi.customer.getPaymentMethodOfCustomer(token)
      console.log("getPaymentMethod", JSON.stringify(response))

      // this.orderByCustomer(token)
      this.getPrudentialEmployeeBill()
    } catch (err) {

    }
  }

  async getPrudentialEmployeeBill() {
    try {
      let response = await this.innowayApi.bill.getPrudentialEmployeeBill({
        customer_type: "DEPARTMENT"
      })
      console.log("getPrudentialEmployeeBill", JSON.stringify(response))

      this.getPrudentialPaidHistory()
      this.createPaymentOrderUrlWebsite()
    } catch (err) {

    }
  }

  async createPaymentOrderUrlWebsite(){
    try{
      let response = await this.innowayApi.vnpay.createPaymentOrderUrlWebsite({
        subscriber_id: "5b0134d9ff3f8cf282e80a59",
        country: 'VN',
        currency: 'VND',
        products: [
          {
            "product_id": "8e0b1211-5c1c-11e8-bd70-63b68d378e7f",
            "amount": 3,
            "topping_value_ids": []
          }
        ],
        sub_fee: 0,
        // sub_fee_note: null,
        shipping: true,
        latitude: 10.782620,
        longitude: 106.686703,
        address: "Hoàng Văn Thụ, Phường 4, Tân Bình, Hồ Chí Minh, Vietnam",
        website: "https://prudential-gift.firebaseapp.com/"
      })

      console.log("createPaymentOrderUrlWebsite", JSON.stringify(response))
    }catch(err){

    }
  }

  async getPrudentialPaidHistory() {
    try {
      let response = await this.innowayApi.bill.getPrudentialPaidHistory({
        customer_type: "DEPARTMENT",
        // customer_ids: []
      })
      console.log("getPrudentialEmployeeBill", JSON.stringify(response))
    } catch (err) {

    }
  }

  async orderByCustomer(accessToken: string) {
    try {
      let response = await this.innowayApi.bill.orderOnlineByCustomer(accessToken, {
        "address": "Hoàng Văn Thụ, Phường 4, Tân Bình, Hồ Chí Minh, Vietnam",
        "sub_fee": 0,
        "channel": "chatbot",
        "ship_method": "area",
        "is_vat": true,
        "latitude": 10.782620,
        "longitude": 106.686703,

        "subscriber_id": "5b0134d9ff3f8cf282e80a59",
        "payment_method": "SALARY",
        "products": [
          {
            "product_id": "8e0b1211-5c1c-11e8-bd70-63b68d378e7f",
            "amount": 3,
            "topping_value_ids": []
          }
        ]
      })

      console.log("orderByCustomer", JSON.stringify(response))
    } catch (err) {

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
    if (form.valid && !this.isExisted) { //&& this.isValidPhone
      if (this.company === "PRUDENTIAL") {
        let { username, password, prudCustomerType } = this;
        let type: string = prudCustomerType
        await this.innowayApi.customer.createAccount({
          username,
          password,
          type
        })
        this.alertAddSuccess();
        form.reset();
        form.resetForm(this.setDefaultData());
      } else {
        let { name, avatar, email, fullname, phone, sex, status } = this;
        let trust_point = this.trustPoint;
        let birthday = this.birthday ? new Date(this.birthday) : null;
        sex = sex == null || sex == "null" ? null : sex;
        await this.innowayApi.customer.add({ name, avatar, birthday, email, fullname, phone, sex: sex as any, status, trust_point })
        this.alertAddSuccess();
        form.reset();
        form.resetForm(this.setDefaultData());
      }
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid && !this.isExisted) { //&& this.isValidPhone
      let { name, avatar, email, fullname, phone, sex, status } = this;
      let trust_point = this.trustPoint;
      let birthday = this.birthday ? new Date(this.birthday) : null;
      sex = sex == null || sex == "null" ? null : sex;
      await this.innowayApi.customer.update(this.id, { name, avatar, birthday, email, fullname, phone, sex: sex as any, status, trust_point })
      this.alertUpdateSuccess();
      form.reset();
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
      this.alertAddFailed();
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

  async validateCustomerByPhone(phone: string) {
    try {
      let response = await this.innowayApi.customer.getCustomerByPhone({
        phone: _.toString(phone)
      })
      if (response != null && response.code != 500) {
        console.log(JSON.stringify(response));
        if (this.currentPhone != null && this.currentPhone == phone) {
          this.isExisted = false;
        } else {
          this.isExisted = true;
        }
      } else {
        this.isExisted = false;
      }
    } catch (err) {
      this.isExisted = false;
    }
  }

  onBlurMethodPhone(event) {
    if (event.isTrusted) {
      let data = this.globals.convertStringToFormatPhone(this.phone);
      this.phone = data.phone;
      this.isValidPhone = data.isValid;
      this.validateCustomerByPhone(this.phone);
    }
  }
}
