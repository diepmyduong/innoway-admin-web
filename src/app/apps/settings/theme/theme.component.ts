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
  bannerLogo: string;
  bannerBackgroundImage: string;
  bannerBackgroundColor: string;
  defaultProductImage: string;
  defaultProductColor: string;
  defaultPromotionCover: string;
  navbarColor: string;
  footerColor: string;
  priceColor: string;
  logoCircle: string;

  primarypickerColor: string;
  lightpickerColor: string;
  darkpickerColor: string;
  bannerBackgroundColorpickerColor: string;
  defaultProductColorpickerColor: string;
  navbarColorpickerColor: string;
  footerColorpickerColor: string;
  priceColorpickerColor: string;

  id: string;

  constructor(
    private innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.getTheme()
  }

  onChangeColorHex8(color: string, name: string) {
    switch (name) {
      case 'primary': {
        this.primary = color;
        break;
      }
      case 'light': {
        this.light = color;
        break;
      }
      case 'dark': {
        this.dark = color;
        break;
      }
      case 'bannerBackgroundColor': {
        this.bannerBackgroundColor = color;
        break;
      }
      case 'defaultProductColor': {
        this.defaultProductColor = color;
        break;
      }
      case 'navbarColor': {
        this.navbarColor = color;
        break;
      }
      case 'footerColor': {
        this.footerColor = color;
        break;
      }
      case 'priceColor': {
        this.priceColor = color;
        break;
      }
    }
    this.ref.detectChanges();
  }

  async getTheme() {
    try {
      let data = await this.innowayApi.brandTheme.getTheme();

      this.id = data.id
      this.primary = data.primary;
      this.primarypickerColor = data.primary;
      this.light = data.light;
      this.lightpickerColor = data.light;
      this.dark = data.dark;
      this.darkpickerColor = data.dark;
      this.logo = data.logo;
      this.bannerLogo = data.banner_logo;
      this.bannerBackgroundImage = data.banner_background_image;
      this.bannerBackgroundColor = data.banner_background_color;
      this.bannerBackgroundColorpickerColor = data.banner_background_color;
      this.defaultProductImage = data.default_product_image;
      this.defaultProductColor = data.default_product_color;
      this.defaultProductColorpickerColor = data.default_product_color;
      this.defaultPromotionCover = data.default_promotion_cover;
      this.navbarColor = data.navbar_color;
      this.navbarColorpickerColor = data.navbar_color;
      this.footerColor = data.footer_color;
      this.footerColorpickerColor = data.footer_color;
      this.priceColor = data.price_color;
      this.priceColorpickerColor = data.price_color;
      this.logoCircle = data.logo_circle;
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
      let data: any = {} //JSON.parse(this.contentJSON);
      data.primary = this.primary;
      data.light = this.light;
      data.dark = this.dark;
      data.logo = this.logo;
      data.banner_logo = this.bannerLogo;
      data.banner_background_image = this.bannerBackgroundImage;
      data.banner_background_color = this.bannerBackgroundColor;
      data.default_product_image = this.defaultProductImage;
      data.default_product_color = this.defaultProductColor;
      data.default_promotion_cover = this.defaultPromotionCover;
      data.navbar_color = this.navbarColor;
      data.footer_color = this.footerColor;
      data.price_color = this.priceColor;
      data.logo_circle = this.logoCircle;

      console.log("bi bi", JSON.stringify(data))
      let response = await this.innowayApi.brandTheme.update(this.id, data)
      this.getTheme();
      console.log(JSON.stringify(response))
      this.alertUpdateSuccess()
    } catch (err) {
      this.alertUpdateFail()
      console.log(err);
    }
  }

  alertUpdateFail() {
    swal({
      title: 'Cập nhật thất bại',
      type: 'warning',
      timer: 1000
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Cập nhật thành công',
      type: 'success',
      timer: 1000,
    })
  }


}
