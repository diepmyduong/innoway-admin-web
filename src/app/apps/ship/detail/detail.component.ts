import { Component, OnInit } from '@angular/core';
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

declare let swal: any
declare var innoway2: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  id: string;
  item: any;
  itemFields: any = ['$all', {
    brand_ship: ["$all"]
  }];

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innowayApi: InnowayApiService
  ) {
  }

  ngOnInit() {
    this.id = this.innowayApi.innowayAuth.innowayUser.brand_id

    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async setData() {
    try {
      this.item = await this.innowayApi.brand.getItem(this.id, {
        local: false,
        query: { fields: this.itemFields }
      })
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }
}
