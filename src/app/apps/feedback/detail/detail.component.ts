import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DetailPageInterface } from "app/interface/detailPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
declare var swal: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  customerService: any;
  id: string;
  item: any;
  itemFields: any = ['$all'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
      private ref: ChangeDetectorRef,
    public innoway: InnowayService
  ) {
    this.customerService = innoway.getService('customer');
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
      this.item = await this.customerService.get(this.id, {
        fields: this.itemFields
      })
      this.ref.detectChanges();
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem() {
    this.router.navigate(['/customer/add', this.id]);
  }

  backToList() {
    this.router.navigate(['/customer/list'])
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }
}
