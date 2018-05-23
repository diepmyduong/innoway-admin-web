import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InnowayApiService } from 'app/services/innoway';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MapsAPILoader } from "@agm/core";

declare let swal: any

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  id: any;
  isEdit: boolean = false;

  submitting: boolean = false;


  supplierCategory: string
  supplierCategorys: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  name: string
  description: string
  type: string

  address: string
  longitude: string
  latitude: string
  status: number = 1

  latitudeMap: number;
  longitudeMap: number;
  zoom: number;

  @ViewChild("addressInput")
  searchElementRef: ElementRef;

  @ViewChild("fileUploader")
  fileUploader: ElementRef;

  progress: boolean | number = false;

  isUploadImage: boolean = false;
  fileUpload: File;
  previewImage: string;
  closeImage: string = "https://d30y9cdsu7xlg0.cloudfront.net/png/55049-200.png";
  errorImage: string = "http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader,
    public innowayApi: InnowayApiService,
    private ngZone: NgZone) {

  }

  ngOnInit() {
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

    this.loadSupplierCategory();

    this.setDefaultMap();
    this.setAutocompleteMap();
  }

  async loadSupplierCategory() {
    try {
      this.supplierCategorys.next(await this.innowayApi.supplierCategory.getList({
        query: {
          fields: ["$all"]
        }
      }));
    } catch (err) {

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
    this.status = 1
    this.supplierCategory = null;
    this.address = null
    this.longitude = null
    this.latitude = null
    this.description = null
    this.name = null
    this.type = null

    if (this.supplierCategorys.getValue()[0]) {
      this.supplierCategory = this.supplierCategorys.getValue()[0].id;
    }

    return {
      status: this.status,
      supplierCategory: this.supplierCategory,
      address: this.address,
      longitude: this.longitude,
      latitude: this.latitude,
      description: this.description,
      name: this.name,
      type: this.type
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.supplier.getItem(this.id, {
        query: { fields: ["$all"] }
      })
      this.status = data.status
      this.supplierCategory = data.supplier_category_id
      this.address = data.address
      this.longitude = data.longitude.toString()
      this.latitude = data.latitude.toString()
      this.description = data.description
      this.name = data.name
      this.type = data.type
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      this.backToList()
    }
  }

  backToListForAddNew() {
    this.router.navigate(['./../list'], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
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
      let {
        supplierCategory,
        address,
        longitude,
        latitude,
        description,
        name,
        type,
        status,
        } = this;
      let supplier_category_id = supplierCategory;
      await this.innowayApi.supplier.add({
        supplier_category_id,
        address,
        longitude: Number.parseFloat(longitude),
        latitude: Number.parseFloat(latitude),
        description,
        name,
        type,
        status,
      })
      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let {
        supplierCategory,
        address,
        longitude,
        latitude,
        description,
        name,
        type,
        status,
        } = this;
      let supplier_category_id = supplierCategory;
      await this.innowayApi.supplier.update(this.id, {
        supplier_category_id,
        address,
        longitude: Number.parseFloat(longitude),
        latitude: Number.parseFloat(latitude),
        description,
        name,
        type,
        status,
      })
      this.alertUpdateSuccess();
      form.reset();
    } else {
      this.alertFormNotValid();
    }
  }

  async submitAndNew(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
    } catch (err) {
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToListForAddNew();
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

  async onChangeImageFile(event) {
    let files = this.fileUploader.nativeElement.files
    let file = files[0]
    try {
      let response = await this.innowayApi.upload.uploadImage(file)
      this.previewImage = response.link
    } catch (err) {
    }
  }

  onImageError(event) {
    this.previewImage = this.errorImage;
  }

  onImageChangeData(event) {
    this.previewImage = event;
  }

  removeImage() {
    this.previewImage = undefined;
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
