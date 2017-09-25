import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { InnowayService } from "app/services";
import { Router, ActivatedRoute } from "@angular/router";

declare var swal: any;

@Component({
  selector: 'app-bill-location',
  templateUrl: './bill-location.component.html',
  styleUrls: ['./bill-location.component.scss']
})
export class BillLocationComponent implements OnInit {

  longitude: string;
  latitude: string;

  latitudeMap: number;
  longitudeMap: number;
  zoom: number;

  id: string;
  billService: any;
  billActitivyService: any;

  item: any = {};
  itemFields: any = ['$all', {
    activities: ['$all', {
      employee: ['$all', {
        locations: ['$all']
      }]
    }],
    bill_ship_detail: ['$all', {
      employee: ['$all']
    }],
    items: ['$all', {
      product: ['$all'],
      topping_values: ['$all']
    }],
    customer: ['$all']
  }];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.billService = innoway.getService('bill');
    this.billActitivyService = innoway.getService('bill_activity');
  }

  ngOnInit() {
    this.setDefaultMap();

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  setDefaultMap() {
    //set google maps defaults
    this.zoom = 8;
    this.latitudeMap = 39.8282;
    this.longitudeMap = -98.5795;

    //set current position
    this.setCurrentPosition();
  }

  async setData() {
    try {
      this.item = await this.billService.get(this.id, {
        fields: this.itemFields
      });
      this.latitudeMap = this.item.latitude;
      this.longitudeMap = this.item.longitude;
      this.zoom = 15;
      this.ref.detectChanges();
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
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

  backToList() {
    this.router.navigate(['./bills'], { relativeTo: this.route.parent });
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

  async updateAction(action) {
    try {
      let bill_id = this.item.id;
      let employee_id;
      await this.billActitivyService.add({ bill_id, action })
      this.alertAddSuccess();
    }
    catch (err) {
      this.alertAddFailed();
    }
  }
}
