import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
import { NgForm } from "@angular/forms";

declare var innoway2: any;
declare var swal: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  brand_ship_id: string;
  isEdit: boolean = false;
  submitting: boolean = false;
  brandService: any;
  brandShipService: any;

  allow_pick_at_store: number = 0;
  allow_ship: number = 0;
  ship_method: number = 0;
  ship_fee_per_km: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService) {
    this.brandService = innoway.getService('brand');
    this.brandShipService = innoway.getService('brand_ship');
  }

  ngOnInit(): void {
    this.id = innoway2.config.get("brand_id");
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

  setDefaultData() {

  }

  async setData() {
    try {
      let data = await this.brandService.get(this.id, {
        fields: ["$all", {
          brand_ship: ["$all"]
        }]
      });
      this.brand_ship_id = data.brand_ship.id
      if (data.brand_ship.allow_pick_at_store == null) {
        data.brand_ship.allow_pick_at_store = false;
      }
      this.allow_pick_at_store = data.brand_ship.allow_pick_at_store
      if (data.brand_ship.allow_ship == null) {
        data.brand_ship.allow_ship = false;
      }
      this.allow_ship = data.brand_ship.allow_ship
      this.ship_method = data.brand_ship.ship_method
      if (data.brand_ship.ship_fee_per_km == null) {
        data.brand_ship.ship_fee_per_km = 0;
      }
      this.ship_fee_per_km = data.brand_ship.ship_fee_per_km
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      this.backToList()
    }
  }

  backToList() {
    this.router.navigate(['../../'], { relativeTo: this.route });
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
      let { allow_pick_at_store, allow_ship, ship_method, ship_fee_per_km } = this;
      await this.brandService.add({ name, allow_pick_at_store, allow_ship, ship_method, ship_fee_per_km })
      this.alertAddSuccess();
      form.reset();
      form.controls["status"].setValue(1);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { allow_pick_at_store, allow_ship, ship_method, ship_fee_per_km } = this;
      await this.brandShipService.update(this.brand_ship_id, { allow_pick_at_store, allow_ship, ship_method, ship_fee_per_km })
      this.alertUpdateSuccess();
      // form.reset();
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
