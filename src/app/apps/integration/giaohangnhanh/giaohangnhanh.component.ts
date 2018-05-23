import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../Globals"
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

declare var innoway2: any
declare let swal: any
declare var StringeeClient: any
declare let $: any
declare let StringeeCall: any

@Component({
  selector: 'app-giaohangnhanh',
  templateUrl: './giaohangnhanh.component.html',
  providers: [Globals],
  styleUrls: ['./giaohangnhanh.component.scss']
})
export class GiaoHangNhanhComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;

  ghnEmail: string
  ghnPassword: string

  ghnEmailRegister: string
  ghnPasswordRegister: string
  ghnContactNameRegister: string
  ghnContactPhoneRegister: string

  thirdparty: any

  isGHN: boolean = false

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

    this.checkThirdParty(this.id)
  }

  setData() {

  }

  setDefaultData() {

  }

  async loginGHN() {
    try {
      let response = await this.innowayApi.shipment.loginGHN({
        email: this.ghnEmail,
        password: this.ghnPassword
      })
      console.log("loginGHN", JSON.stringify(response))
    } catch (err) {
      console.log("loginGHN", err)
    }
  }

  async registerGHN() {
    try {
      let response = await this.innowayApi.shipment.registerGHN({
        email: this.ghnEmailRegister,
        password: this.ghnPasswordRegister,
        contact_name: this.ghnContactNameRegister,
        contact_phone: this.ghnContactPhoneRegister
      })
      console.log("registerGHN", JSON.stringify(response))
    } catch (err) {
      console.log("registerGHN", err)
    }
  }

  async checkThirdParty(brandId: string) {
    try {
      let response = await this.innowayApi.brand.getItem(brandId, {
        query: {
          local: false,
          fields: ["name", {
            thirdpary_shippers: ["$all"]
          }]
        }
      })

      response.thirdpary_shippers.forEach(thirdparty => {
        if (thirdparty.type === "GHN") {
          this.isGHN = true
          this.thirdparty = thirdparty
          console.log("GHN", this.isGHN)
          this.ref.detectChanges()
          return;
        }
      })

      console.log("checkThirdParty", JSON.stringify(response))
    } catch (err) {

    }
  }

}
