import { Component, OnInit } from '@angular/core';
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

  employeeTypeService: any;
  id: string;
  item: any;
  itemFields: any = ['$all'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public innoway: InnowayService
  ) {
    this.employeeTypeService = innoway.getService('customer_type');
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
      this.item = await this.employeeTypeService.get(this.id, {
        fields: this.itemFields
      })
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  editItem() {
    this.router.navigate(['/customer-type/add', this.id]);
  }

  backToList() {
    this.router.navigate(['/customer-type/list'])
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

}
