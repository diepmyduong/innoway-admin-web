import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Globals } from '../../globals'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { MapsAPILoader } from "@agm/core";

@Component({
  selector: 'app-update-bill-data',
  providers: [Globals],
  templateUrl: './update-bill-data.component.html',
  styleUrls: ['./update-bill-data.component.scss']
})
export class UpdateBillDataDialog implements OnInit {

  info = {};
  isValid: boolean;

  currentActivity: string;
  billActivity: string;
  billActivities: any[];
  subFee: string = "0";
  subFeeNote: string = "";
  employee: string;
  employees: any[];
  note: string;
  noteBillActivity: string;
  weightBillActivity: string;

  isShowEditInfo: boolean;

  error: string;

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  address: string

  latitude: string;
  longitude: string;

  latitudeMap: number;
  longitudeMap: number;
  zoom: number;

  thirdparty: string;
  thirdparties: any[];

  isShowWeight: boolean = false
  isShowAddress: boolean = false
  isShowEmployee: boolean = true
  isShowThirdparty: boolean = false

  @ViewChild("addressInput")
  searchElementRef: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<UpdateBillDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ref: ChangeDetectorRef,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private globals: Globals) {

  }

  ngOnInit() {
    console.log(this.data);

    this.subFee = this.data.subFee;
    this.subFeeNote = this.data.subFeeNote;
    this.employees = this.data.employees;
    this.employee = this.employees ? this.employees[0].id : null;
    this.currentActivity = this.data.activity ? this.data.activity : this.globals.BILL_ACTIVITIES[0].code;
    this.billActivities = [];
    this.note = this.data.note;

    let options = this.globals.avaibleBillActivityOption(this.currentActivity);

    options.forEach(option => {
      this.billActivities.push({ code: Object.keys(option)[0], name: option[Object.keys(option)[0]] });
    });

    this.billActivity = this.billActivities && this.billActivities.length > 0 ? this.billActivities[0].code : null;

    this.thirdparties = this.globals.SHIPMENT_THIRD_PARTIES
    this.thirdparty = "MCOM"

    this.validateInputData();
    this.changeBillActivity(this.billActivity);
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
    try {
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
    } catch (err) {
      console.log("setAutocompleteMap", err)
    }
  }

  validateInputData() {
    this.isValid = true;

    this.isShowEditInfo = true;
    switch (this.currentActivity) {
      case "BILL_CONFIRMED":
      case "BILL_MODIFIED_AT_BILL_CONFIRMED":
      case "BILL_CANCELLED_AT_BILL_CONFIRMED":
      case "BILL_PICKING_UP":
      case "BILL_MODIFIED_AT_PICKING_UP":
      case "BILL_CANCELLED_AT_PICKING_UP":
      case "BILL_RECEIVED":
      case "BILL_MODIFIED_AT_RECEIVED":
      case "BILL_CANCELLED_AT_RECEIVED":
      case "BILL_PROCESSING":
      case "BILL_MODIFIED_AT_PROCESSING":
      case "BILL_CANCELLED_AT_PROCESSING":
      case "BILL_PREPARED":
      case "BILL_MODIFIED_AT_PREPARED":
      case "BILL_CANCELLED_AT_PREPARED":
      case "BILL_SENT_SHIPPER":
      case "BILL_MODIFIED_AT_SENT_SHIPPER":
      case "BILL_CANCELLED_AT_SENT_SHIPPER":
      case "BILL_DELIVERING":
      case "BILL_MODIFIED_AT_DELIVERING":
      case "BILL_CANCELLED_AT_DELIVERING":
      case "BILL_PAID":
      case "BILL_MODIFIED_AT_PAID":
      case "BILL_COLLECTED_MONEY":
      case "BILL_MODIFIED_AT_COLLECTED_MONEY": {
        this.isShowEditInfo = false;
      }
    }

    this.ref.detectChanges();
  }

  confirmBillStatus() {
    this.info["action"] = "updateBillStatus"
    this.info["billActivity"] = this.billActivity;
    this.info["employee"] = this.employee;
    this.info["noteBillActivity"] = this.noteBillActivity;
    this.info["weight"] = this.weightBillActivity;
    this.info["thirdparty"] = this.thirdparty;
    this.info["longitude"] = this.longitude
    this.info["latitude"] = this.latitude
    this.info["address"] = this.address
  }

  confirmSubFee() {
    this.info["action"] = "updateSubFee"
    this.info["subFee"] = this.subFee;
    this.info["subFeeNote"] = this.subFeeNote;
  }

  confirmNote() {
    this.info["action"] = "updateNote"
    this.info["note"] = this.note;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeBillActivity(value: string) {
    console.log("changeBillActivity", value)
    switch (value) {
      case "BILL_SENT_SHIPPER": {
        this.isShowThirdparty = true
        break
      }
      default: {
        this.isShowThirdparty = false
      }
    }
    this.ref.detectChanges()
  }

  changeThirdpartyActivity(value: string) {
    console.log("changeThirdpartyActivity", value)
    switch (value) {
      case 'UBER_DELIVER': {
        this.isShowAddress = true
        this.isShowWeight = false
        this.setDefaultMap();
        this.setAutocompleteMap();
        break
      }
      case 'GHN': {
        this.isShowAddress = true
        this.isShowWeight = true
        this.setDefaultMap();
        this.setAutocompleteMap();
        break
      }
      case 'GHTK': {
        this.isShowAddress = true
        this.isShowWeight = true
        this.setDefaultMap();
        this.setAutocompleteMap();
        break
      }
      case 'MCOM':
      default: {
        this.isShowAddress = false
        this.isShowWeight = false
        break
      }
    }
    this.ref.detectChanges()
  }

}
