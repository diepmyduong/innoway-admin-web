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
  selector: 'app-kiotviet',
  templateUrl: './kiotviet.component.html',
  providers: [Globals],
  styleUrls: ['./kiotviet.component.scss']
})
export class KiotvietComponent implements OnInit {
  id: any;
  brand_ship_id: string;
  isEdit: boolean = false;
  submitting: boolean = false;

  kiotvietAPIKey: string
  kiotvietPassword: string
  kiotvietSharedSecret: string
  kiotvietAddress: string

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

  kiotVietClientId: string
  kiotVietClientSecret: string
  kiotVietRetailer: string

  async connectKiotViet() {
    try {
      let response = await this.innowayApi.thirdpartyKiotViet.connect({
        client_id: this.kiotVietClientId,
        client_secret: this.kiotVietClientSecret,
        retailer: this.kiotVietRetailer,
      })
    } catch (err) {
      console.log("connectKiotViet", err)
    }
  }

  async syncAllProduct() {
    try {
      this.syncAllBranchKiotViet();
    } catch (err) {
      console.log("syncAllProduct", err)
    }
  }

  async syncAllBranchKiotViet() {
    try {
      let response = await this.innowayApi.thirdpartyKiotViet.syncBranchFromKiotViet({
        type: "overwrite"
      })
      this.syncAllCategoryKiotViet();
      console.log("syncAllBranchKiotViet", JSON.stringify(response))
    } catch (err) {
      console.log("syncAllBranchKiotViet", err)
    }
  }

  async syncAllCategoryKiotViet() {
    try {
      let response = await this.innowayApi.thirdpartyKiotViet.syncCategoryFromKiotViet({
        type: "overwrite"
      })
      this.syncAllProductKiotViet();
      console.log("syncAllCategoryKiotViet", JSON.stringify(response))
    } catch (err) {
      console.log("syncAllCategoryKiotViet", err)
    }
  }

  async syncAllProductKiotViet() {
    try {
      let response = await this.innowayApi.thirdpartyKiotViet.syncProductFromKiotViet({
        type: "overwrite"
      })
      console.log("syncAllProductKiotViet", JSON.stringify(response))
    } catch (err) {
      console.log("syncAllProductKiotViet", err)
    }
  }

  async disconnectKiotviet() {
    try {
      let response = await this.innowayApi.thirdpartyKiotViet.disconnect()
      console.log("disconnectKiotviet", JSON.stringify(response))
    } catch (err) {
      console.log("disconnectKiotviet", err)
    }
  }

}
