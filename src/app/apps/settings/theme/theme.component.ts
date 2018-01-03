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

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  contentJSON: string;

  status = 1;
  primary: string;
  light: string;
  dark: string;
  logo: string;
  banner_logo: string;
  banner_background_image: string;
  banner_background_color: string;
  default_product_image: string;
  default_product_color: string;
  default_promotion_cover: string;
  navbar_color: string;
  footer_color: string;
  price_color: string;
  logo_circle: string;

  id: string;

  constructor(
    private innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.getTheme()
  }

  async getTheme() {
    try {
      let data = await this.innowayApi.brandTheme.getTheme();
      this.id = data.id
      this.contentJSON = JSON.stringify(data)
      console.log("getTheme", JSON.stringify(data))
      this.ref.detectChanges()
    } catch (err) {

    }
  }

  // {
  //             primary: "#2ba8d6",
  //             light: "#6edaff",
  //             dark: "#0079a4",
  //             banner_logo: "https://i.imgur.com/aHN8fUc.png",
  //             banner_background_image: "https://i.imgur.com/mDy5P4w.png",
  //             banner_background_color: "",
  //             default_product_image: "",
  //             default_promotion_cover: "",
  //             navbar_color: "",
  //             footer_color: "",
  //             price_color: "#ffc107",
  //             logo_circle: "https://i.imgur.com/ZeXC8pg.png"
  //         }

  async updateTheme() {
    try {
      let data: any = JSON.parse(this.contentJSON);
      // this.primary = data.primary;
      // this.light = data.light;
      // this.dark = data.dark;
      // this.logo = data.logo;
      // this.banner_logo = data.banner_logo;
      // this.banner_background_image = data.banner_background_image;
      // this.banner_background_color = data.banner_background_color;
      // this.default_product_image = data.default_product_image;
      // this.default_product_color = data.default_product_color;
      // this.default_promotion_cover = data.default_promotion_cover;
      // this.navbar_color = data.navbar_color;
      // this.footer_color = data.footer_color;
      // this.price_color = data.price_color;
      // this.logo_circle = data.logo_circle;

      console.log("bi bi", JSON.stringify(data))
      let response = await this.innowayApi.brandTheme.update(this.id, data)
      console.log(JSON.stringify(response))
    } catch (err) {
      console.log(err);
    }
  }


}
