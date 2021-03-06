import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DetailPageInterface } from 'app/apps/interface/detailPageInterface';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayApiService } from 'app/services/innoway'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MapsAPILoader } from "@agm/core";

declare let swal:any
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  id: string;
  item: any;
  itemFields: any = ['$all'];

  latitudeMap: number;
  longitudeMap: number;
  zoomMap: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innowayApi: InnowayApiService,
    private mapsAPILoader: MapsAPILoader,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async setData() {
    try {
      this.item = await this.innowayApi.branch.getItem(this.id, {
        query: { fields: this.itemFields }
      })
      this.longitudeMap = Number.parseFloat(this.item.longitude);
      this.latitudeMap = Number.parseFloat(this.item.latitude);
      this.zoomMap = 12;
      this.ref.detectChanges();
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem() {
        this.router.navigate(['../../add', this.id], { relativeTo: this.route});
  }

  backToList() {
    this.router.navigate(['../list'],{ relativeTo : this.route});
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

}
