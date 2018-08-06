import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild("fileLogoUploader")
  fileLogoUploader: ElementRef;
  @ViewChild("fileBannerLogoUploader")
  fileBannerLogoUploader: ElementRef;
  @ViewChild("fileBackgroundImageUploader")
  fileBackgroundImageUploader: ElementRef;
  @ViewChild("fileProductImageUploader")
  fileProductImageUploader: ElementRef;
  @ViewChild("fileLogoCircleUploader")
  fileLogoCircleUploader: ElementRef;

  progress: boolean | number = false;
  isUploadImage: boolean = false;

  fileLogoUpload: File;
  fileBannerLogoUpload: File;
  fileBannerImageUpload: File;
  fileProductImageUpload: File;
  fileLogoCircleUpload: File;

  previewLogoImage: string;
  previewBannerLogoImage: string;
  previewBackgroundImage: string;
  previewProductImage: string;
  previewLogoCircleImage: string;

  closeImage: string = "https://d30y9cdsu7xlg0.cloudfront.net/png/55049-200.png";
  errorImage: string = "http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png";

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
      this.previewLogoImage = data.logo;
      this.bannerLogo = data.banner_logo;
      this.previewBannerLogoImage = data.banner_logo;
      this.bannerBackgroundImage = data.banner_background_image;
      this.previewBackgroundImage = data.banner_background_image;
      this.bannerBackgroundColor = data.banner_background_color;
      this.bannerBackgroundColorpickerColor = data.banner_background_color;
      this.defaultProductImage = data.default_product_image;
      this.previewProductImage = data.default_product_image;
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
      this.previewLogoCircleImage = data.logo_circle;
      this.contentJSON = JSON.stringify(data)
      this.ref.detectChanges()
    } catch (err) {

    }
  }

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

  async onChangeImageFile(event, type) {
    switch (type) {
      case "logo": {
        let files = this.fileLogoUploader.nativeElement.files
        let file = files[0]
        try {
          let response = await this.innowayApi.upload.uploadImage(file)
          this.previewLogoImage = response.link
          this.logo = response.link
        } catch (err) {
        }
        break;
      }
      case "banner_logo": {
        let files = this.fileBannerLogoUploader.nativeElement.files
        let file = files[0]
        try {
          let response = await this.innowayApi.upload.uploadImage(file)
          this.previewBannerLogoImage = response.link
          this.bannerLogo = response.link
        } catch (err) {
        }
        break;
      }
      case "background_image": {
        let files = this.fileBackgroundImageUploader.nativeElement.files
        let file = files[0]
        try {
          let response = await this.innowayApi.upload.uploadImage(file)
          this.previewBackgroundImage = response.link
          this.bannerBackgroundImage = response.link
        } catch (err) {
        }
        break;
      }
      case "product_image": {
        let files = this.fileProductImageUploader.nativeElement.files
        let file = files[0]
        try {
          let response = await this.innowayApi.upload.uploadImage(file)
          this.previewProductImage = response.link
          this.defaultProductImage = response.link
        } catch (err) {
        }
        break;
      }
      case "logo_circle": {
        let files = this.fileLogoCircleUploader.nativeElement.files
        let file = files[0]
        try {
          let response = await this.innowayApi.upload.uploadImage(file)
          this.previewLogoCircleImage = response.link
          this.logoCircle = response.link
        } catch (err) {
        }
        break;
      }
    }
  }

  onImageError(event, type) {
    switch (type) {
      case "logo": {
        this.previewLogoImage = this.errorImage;
        break;
      }
      case "banner_logo": {
        this.previewBannerLogoImage = this.errorImage;
        break;
      }
      case "background_image": {
        this.previewBackgroundImage = this.errorImage;
        break;
      }
      case "product_image": {
        this.previewProductImage = this.errorImage;
        break;
      }
      case "logo_circle": {
        this.previewLogoCircleImage = this.errorImage;
        break;
      }
    }
  }

  onImageChangeData(event, type) {
    switch (type) {
      case "logo": {
        this.previewLogoImage = event;
        break;
      }
      case "banner_logo": {
        this.previewBannerLogoImage = event;
        break;
      }
      case "background_image": {
        this.previewBackgroundImage = event;
        break;
      }
      case "product_image": {
        this.previewProductImage = event;
        break;
      }
      case "logo_circle": {
        this.previewLogoCircleImage = event;
        break;
      }
    }
  }

  removeImage(type) {
    switch (type) {
      case "logo": {
        this.previewLogoImage = undefined;
        break;
      }
      case "banner_logo": {
        this.previewBannerLogoImage = undefined;
        break;
      }
      case "background_image": {
        this.previewBackgroundImage = undefined;
        break;
      }
      case "product_image": {
        this.previewProductImage = undefined;
        break;
      }
      case "logo_circle": {
        this.previewLogoCircleImage = undefined;
        break;
      }
    }
  }

  startLoading() {
    this.progress = 0;
    setTimeout(() => {
      this.progress = 0.5;
    }, 30000);
  }

  endLoading() {
    this.progress = 1;

    setTimeout(() => {
      this.progress = false;
    }, 200);
  }

}
