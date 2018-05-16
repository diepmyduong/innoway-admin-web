import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import * as moment from 'moment';
import { Globals } from "./../../../globals";
import { InnowayApiService } from "app/services/innoway";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MapsAPILoader } from "@agm/core";

declare var swal: any

@Component({
  selector: 'app-config',
  providers: [Globals],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  employee: any;

  name: string;
  color: string = "#127bdc";
  logo: string;
  trialExpire: string;
  status: number = 1;
  vatValue: number;
  openHour: string;
  closeHour: string;
  address: string;
  phone: string;
  isOnlinePayment: boolean = false;
  public description;

  latitude: string;
  longitude: string;

  latitudeMap: number;
  longitudeMap: number;
  zoom: number;

  @ViewChild("addressInput")
  searchElementRef: ElementRef;

  brandCategory: string;
  brandCategories: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  timeMask = [/\d/, /\d/, ':', /\d/, /\d/];

  days = [
    {
      name: "T2",
      code: "monday",
      status: false
    },
    {
      name: "T3",
      code: "tuesday",
      status: false
    },
    {
      name: "T4",
      code: "wednesday",
      status: false
    },
    {
      name: "T5",
      code: "thursday",
      status: false
    },
    {
      name: "T6",
      code: "friday",
      status: false
    },
    {
      name: "T7",
      code: "saturday",
      status: false
    },
    {
      name: "CN",
      code: "sunday",
      status: false
    }
  ]

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.employee = this.innowayApi.innowayAuth.innowayUser;
  }

  async ngOnInit() {
    this.setData(this.employee.brand_id);
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

          this.address = place.formatted_address;

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

  setDefaultData() {
    this.status = 1;
    return {
      status: this.status
    }
  }

  async loadBrandCategories() {
    try {
      this.brandCategories.next(await this.innowayApi.brandCategory.getList({
        query: {
          fields: ["$all"]
        }
      }))
      if (this.brandCategories) {
        this.brandCategory = this.brandCategories[0].id;
      }
    } catch (err) {

    }
  }

  async setData(brandId) {
    try {
      let data = await this.innowayApi.brand.getItem(brandId, {
        query: { fields: ["$all"] }
      })

      this.name = data.name
      this.color = data.color
      if (this.color) {
        this.onChangeColorHex8(this.color)
      }
      this.isOnlinePayment = data.is_enable_online_payment
      this.logo = data.logo
      this.trialExpire = data.trail_expire
      this.status = data.status
      this.address = data.address
      this.vatValue = data.vat_value
      this.phone = data.phone
      this.openHour = data.open_hour_online
      this.closeHour = data.close_hour_online
      this.description = data.description
      this.brandCategory = data.brand_category_id ? data.brand_category_id : null

      data.open_days_of_week.forEach(v => {
        let pos = -1;
        let count = 0;
        this.days.forEach(day => {
          if (v == day.code) {
            pos = count;
          }
          count++;
        })
        if (pos != -1) {
          this.days[pos].status = true;
        } else {
          this.days[pos].status = false;
        }
      })
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      // this.backToList()
    }
  }

  backToList() {
    this.router.navigate(['./../../config'], { relativeTo: this.route });
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
    if (form.valid) {

      let { name, color, logo, trialExpire, description, address, vatValue, openHour, closeHour, brandCategory, status, isOnlinePayment } = this;
      let brand_category_id = brandCategory
      let trial_expire = trialExpire
      let vat_value = vatValue
      let is_enable_online_payment = isOnlinePayment
      let open_hour_online = moment(openHour, "HH:mm").format("HH:mm");
      let close_hour_online = moment(closeHour, "HH:mm").format("HH:mm");
      let open_days_of_week: string[] = [];
      this.days.forEach(day => {
        if (day.status) {
          open_days_of_week.push(day.code);
        }
      });
      await this.innowayApi.brand.add({
        name, color, logo, trial_expire, description, address, vat_value,
        open_hour_online, close_hour_online, open_days_of_week, brand_category_id, status, is_enable_online_payment
      })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      try {
        let { name, color, logo, trialExpire, description, address, phone, vatValue, openHour, closeHour, brandCategory, status, isOnlinePayment } = this;
        let brand_category_id = brandCategory
        let trial_expire = trialExpire;
        let vat_value = vatValue
        let is_enable_online_payment = isOnlinePayment
        let open_hour_online = moment(openHour, "HH:mm").format("HH:mm");
        let close_hour_online = moment(closeHour, "HH:mm").format("HH:mm");
        let open_days_of_week: string[] = [];
        this.days.forEach(day => {
          if (day.status) {
            open_days_of_week.push(day.code);
          }
        });

        await this.innowayApi.brand.update(this.employee.brand_id, {
          name, color, logo, trial_expire, description, address, vat_value, phone,
          open_hour_online, close_hour_online, open_days_of_week, brand_category_id, status, is_enable_online_payment
        })
        this.alertUpdateSuccess();
        // form.reset();
      } catch (err) {
        // alert(err.toString())
      }
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
      this.backToList();
    } catch (err) {
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.updateItem(form);
    } catch (err) {
      this.alertUpdateFailed();
    } finally {
      this.submitting = false;
    }
  }

  onChangeColorHex8(color: string) {
    this.color = color;
  }

  checkDayStatus(event, data) {
    let pos = 0;
    let count = 0;
    this.days.forEach(day => {
      if (day.name == data.name) {
        pos = count;
      }
      count++;
    })
    this.days[pos].status = this.days[pos].status ? false : true;
  }

  checkOnlinePayment(event, data) {
    this.isOnlinePayment = !data
  }
}
