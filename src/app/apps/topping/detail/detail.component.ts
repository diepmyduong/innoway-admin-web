import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef } from '@angular/core';

import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { DetailPageInterface } from '../../interface/detailPageInterface';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from 'app/services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import createNumberMask from 'text-mask-addons/dist/createNumberMask'

declare let swal: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  toppingValueService: any;
  id: string;
  item: any;
  itemFields: any = ["$all", {
    topping: ["name"]
  }];

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innoway: InnowayService
  ) {
    this.toppingValueService = innoway.getService('topping_value');
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
      this.item = await this.toppingValueService.get(this.id, {
        fields: this.itemFields
      })
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem() {
    this.router.navigate(['../../add', this.id], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }


}
