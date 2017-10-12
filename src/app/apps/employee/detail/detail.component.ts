import { Component, OnInit } from '@angular/core';
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayService } from "app/services";
import { Globals } from "./../../../globals";
declare let swal:any
@Component({
  selector: 'app-detail',
  providers: [Globals],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  employeeTypeService: any;
  id: string;
  item: any;
  itemFields: any = ['$all', {
    branch: ["id", "name"]
  }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globals: Globals,
    public innoway: InnowayService
  ) {
    this.employeeTypeService = innoway.getService('employee');
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

  detectEmployeeType(code: string): string {
    let result: any = this.globals.detectEmployeeByCode(code);
    return result;
  }
}
