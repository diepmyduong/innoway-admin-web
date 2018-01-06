import { Component, OnInit } from '@angular/core';
import { Globals } from "./../../globals";
import { InnowayApiService } from "app/services/innoway";
import { NgForm } from "@angular/forms";
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as Console from 'console-prefix';
import { Router } from "@angular/router";

declare var swal: any;

@Component({
  selector: 'app-brand-register',
  providers: [Globals],
  templateUrl: './brand-register.component.html',
  styleUrls: ['./brand-register.component.scss'],
  animations: [
    trigger('fade', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('* => *', animate('.5s'))
    ]),
  ]
})
export class BrandRegisterComponent implements OnInit {

  brandName: string;
  brandPhone: string;
  brandAddress: string;
  brandCode: string;

  adminFullname: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;

  isValid: boolean = false;
  submitting = false;

  constructor(public innowayApi: InnowayApiService,
    public router: Router) {

  }

  ngOnInit() {

  }

  async registerNewBrand(form: NgForm) {
    try {
      if (form.valid) {
        let request: any = {
          brand_name: this.brandName,
          brand_address: this.brandAddress,
          brand_phone: this.brandPhone,
          brand_code: this.brandCode,

          longitude: 106.694035,
          latitude: 10.787068,

          admin_fullname: this.adminFullname,
          admin_phone: this.adminPhone,
          admin_email: this.adminEmail,
          admin_password: this.adminPassword
        }
        let data = await this.innowayApi.brand.registerNewBrand(request)
        console.log("register", JSON.stringify(data))
      } else {
        this.alertFormNotValid("Vui lòng kiểm tra lại nội dung đã nhập")
      }
    } catch (err) {
      console.log(err)
    }
  }

  async alertFormNotValid(message = "") {
    return await swal({
      title: 'Nội dung nhập không hợp lệ',
      text: message,
      type: 'warning',
      showConfirmButton: false,
      timer: 1000,
    })
  }

  async alertAuthError(message = "") {
    return await swal({
      title: message,
      type: 'warning',
      showConfirmButton: false,
      timer: 1000,
    })
  }

  login() {
    this.router.navigate(["login"])
  }

}
