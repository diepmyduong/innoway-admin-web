import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../Globals"
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

declare var innoway2: any
declare let swal: any

@Component({
  selector: 'app-ghtk',
  templateUrl: './ghtk.component.html',
  providers: [Globals],
  styleUrls: ['./ghtk.component.scss']
})
export class GhtkComponent implements OnInit {
  id: any;
  brand_ship_id: string;
  isEdit: boolean = false;
  submitting: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innowayApi: InnowayApiService) {
  }

  ngOnInit(): void {
    this.id = this.innowayApi.innowayAuth.innowayUser.brand_id
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

  setData() {

  }

  setDefaultData() {

  }

  ghtkEmail: string
  ghtkPassword: string

  ghtkNameRegister: string
  ghtkEmailRegister: string
  ghtkPasswordRegister: string
  ghtkAddressRegister: string
  ghtkProvinceRegister: string
  ghtkDistrictRegister: string
  ghtkPhoneRegister: string

  async loginGHTK() {
    try {
      let response = await this.innowayApi.shipment.loginGHTK({
        email: this.ghtkEmail,
        password: this.ghtkPassword
      })
      console.log("loginGHTK", JSON.stringify(response))
    } catch (err) {
      console.log("loginGHTK", err)
    }
  }

  async registerGHTK() {
    try {
      let response = await this.innowayApi.shipment.registerGHTK({
        name: this.ghtkNameRegister,
        first_address: this.ghtkAddressRegister,
        province: this.ghtkProvinceRegister,
        district: this.ghtkDistrictRegister,
        tel: this.ghtkPhoneRegister,
        email: this.ghtkEmailRegister
      })
      console.log("registerGHTK", JSON.stringify(response))
    } catch (err) {
      console.log("registerGHTK", err)
    }

  }
}
