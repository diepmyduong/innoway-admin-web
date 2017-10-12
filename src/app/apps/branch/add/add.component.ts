import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";

import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

declare let swal:any

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;
  branchService: any;

  name: string;
  status: number = 1;
  address: string;
  longitude: string;
  latitude: string;
  employee_id: string;
  phone: string;
  type: number = 1;

  latitudeMap: number;
  longitudeMap: number;
  zoom: number;

  @ViewChild("addressInput")
  searchElementRef: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.branchService = innoway.getService('branch');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }

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
    this.type = 1;
  }

  async setData() {
    try {
      let data = await this.branchService.get(this.id, {
        fields: ["$all"]
      });
      this.name = data.name
      this.address = data.address;
      this.longitude = data.longitude;
      this.latitude = data.latitude;
      this.employee_id = data.employee_id;
      this.phone = data.phone;
      this.type = data.type;
      this.status = data.status
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  backToList() {
    this.router.navigate(['../list'],{ relativeTo : this.route});
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
      let { name, address, longitude, latitude, employee_id, phone, type, status } = this;
      await this.branchService.add({ name, address, longitude, latitude, employee_id, phone, type, status })
      this.alertAddSuccess();
      form.reset();
      this.setDefaultData();
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { name, address, longitude, latitude, employee_id, phone, type, status } = this;
      await this.branchService.update(this.id, { name, address, longitude, latitude, employee_id, phone, type, status })
      this.alertUpdateSuccess();
      form.reset();
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
      this.backToList();
    } catch (err) {
      this.alertUpdateFailed();
    } finally {
      this.submitting = false;
    }
  }

}
