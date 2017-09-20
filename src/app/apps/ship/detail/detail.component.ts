import { Component, OnInit } from '@angular/core';
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";

declare var swal: any;
declare var innoway2: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  brandService: any;
  id: string;
  item: any;
  itemFields: any = ['$all', {
    brand_ship: ["$all"]
  }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innoway: InnowayService
  ) {
    this.brandService = innoway.getService('brand');
  }

  ngOnInit() {

    this.id = innoway2.config.get("brand_id");

    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async setData() {
    try {
      this.item = await this.brandService.get(this.id, {
        fields: this.itemFields
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
