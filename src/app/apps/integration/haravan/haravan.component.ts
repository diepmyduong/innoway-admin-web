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
  selector: 'app-haravan',
  templateUrl: './haravan.component.html',
  providers: [Globals],
  styleUrls: ['./haravan.component.scss']
})
export class HaravanComponent implements OnInit {
  id: any;
  brand_ship_id: string;
  isEdit: boolean = false;
  submitting: boolean = false;

  haravanAPIKey: string
  haravanPassword: string
  haravanSharedSecret: string
  haravanAddress: string

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

  async connectHaravan() {
    try {
      let request = {
        api_key: "ba324307c41e7952a4e833c21e858803",
        password: "13e4084a463883fd1e2b17d0ee163f95",
        shared_secret: "725cfed63577da3acb9a714b6a29fa77",
        address: "thanh-liem"
      }
      let response = await this.innowayApi.thirdpartyHaravan.connect(request)
      this.syncAllProduct()
      console.log("connectHaravan", JSON.stringify(response))
    } catch (err) {
      console.log("connectHaravan", err)
    }
  }

  async syncAllProduct() {
    try {
      let response = await this.innowayApi.thirdpartyHaravan.syncAllProduct({
        type: "overwrite"
      })
      console.log("syncAllProduct", JSON.stringify(response))
    } catch (err) {
      console.log("syncAllProduct", err)
    }
  }

  async disconnectHaravan() {
    try {
      let response = await this.innowayApi.thirdpartyHaravan.disconnect()
      console.log("disconnectHaravan", JSON.stringify(response))
    } catch (err) {
      console.log("disconnectHaravan", err)
    }
  }

}
