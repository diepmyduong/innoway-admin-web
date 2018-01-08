import { Component, OnInit, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Globals } from "./../../globals";
import { InnowayApiService } from "app/services/innoway";
import { NgForm, PatternValidator, FormGroup } from "@angular/forms";
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as Console from 'console-prefix';
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MapsAPILoader } from "@agm/core";

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

  brandCategory: string;
  brandCategories: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  isValid: boolean = false;
  submitting = false;

  form: FormGroup;
  status: number = 0;

  longitude: string;
  latitude: string;

  latitudeMap: number;
  longitudeMap: number;
  zoom: number;

  @ViewChild("addressInput")
  searchElementRef: ElementRef;

  constructor(public innowayApi: InnowayApiService,
    public router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ref: ChangeDetectorRef,
    private ngZone: NgZone) {

  }

  async ngOnInit() {
    this.loadBrandCategories()
    this.setDefaultMap();
    this.setAutocompleteMap();

  }

  setDefaultMap() {
    //set google maps defaults
    this.zoom = 8;
    this.latitudeMap = 39.8282;
    this.longitudeMap = -98.5795;

    //set current position
    this.setCurrentPosition();
  }

  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitudeMap = position.coords.latitude;
        this.longitudeMap = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  setAutocompleteMap() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.brandAddress = place.formatted_address;

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat().toString();
          this.longitude = place.geometry.location.lng().toString();

          this.latitudeMap = place.geometry.location.lat();
          this.longitudeMap = place.geometry.location.lng();
          this.zoom = 12;

          this.ref.detectChanges();
        });
      });
    });
  }

  async loadBrandCategories() {
    try {
      this.brandCategories.next(await this.innowayApi.brandCategory.getList({
        query: {
          fields: ["$all"],
          filter: {
            status: { $eq: 1 }
          }
        }
      }))
      if (this.brandCategories.getValue()) {
        this.brandCategory = this.brandCategories.getValue()[0].id;
      }
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  async registerNewBrand(form: NgForm) {
    try {
      if (form.valid) {
        let request: any = {
          brand_name: this.brandName,
          brand_address: this.brandAddress,
          brand_phone: this.brandPhone,
          brand_code: this.brandCode,
          brand_category_id: this.brandCategory,

          longitude: this.longitudeMap,
          latitude: this.latitudeMap,

          admin_fullname: this.adminFullname,
          admin_phone: this.adminPhone,
          admin_email: this.adminEmail,
          admin_password: this.adminPassword
        }
        try {
          let data = await this.innowayApi.brand.registerNewBrand(request)
          this.alertAddSuccess()
          this.login();
        } catch (err) {
          this.alertFormNotValid("Email hoặc Mã doanh nghiệp đã được tạo")
        }
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

  async alertAddSuccess() {
    return swal({
      title: 'Đăng ký thành công',
      type: 'success',
      timer: 1000,
    })
  }

  async alertAddFailed() {
    return swal({
      title: 'Đăng ký thành công',
      type: 'warning',
      timer: 1000,
    })
  }

  login() {
    this.router.navigate(["login"])
  }


  keyPress(event: any) {
    const pattern = /[0-9a-z\+\-]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPressPhone(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPressBrandCode(event: any) {
    const pattern = /[0-9a-z]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
