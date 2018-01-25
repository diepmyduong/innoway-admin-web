import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ListPageInterface } from "app/apps/interface/listPageInterface";
import { DataTable } from "angular-2-data-table-bootstrap4/dist";
import { Router, ActivatedRoute } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { Globals } from "../../../Globals"
declare let swal: any
declare var accounting: any;

@Component({
  selector: 'app-detail',
  providers: [Globals],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";;
  query: any = {};
  searchTimeOut: number = 250;
  searchRef: any;
  id: any;
  bills: any[] = []
  customers: any[] = []
  information: any = {}

  @ViewChild('itemsTable') itemsTable: DataTable;

  constructor(
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getItems();
  }

  async reloadItems(params) {
    let { limit, offset, sortBy, sortAsc } = params;
    this.query.limit = limit;
    this.query.offset = offset;
    this.query.order = sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : null;
    await this.getItems();
  }

  async getItems() {

    this.items.next(await this.innowayApi.promotion.getDetailPromotion(this.id, {
      is_show_used_customer: true,
      is_show_used_bill: true,
    }))

    let data: any = this.items.getValue();
    this.bills = data.results.object.bills;
    this.information = data.results.object;
    this.customers = data.results.object.customers;
    console.log(JSON.stringify(data.results.object.bills))

    this.ref.detectChanges();
    return this.items;
  }

  rowClick(event) {
    console.log('Row clicked', event);
  }

  rowDoubleClick(event) {
    console.log('Row double click', event);
  }

  addItem() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  editItem(item) {
    this.router.navigate(['../add', item.id], { relativeTo: this.route });
  }

  async confirmDelete() {
    return await swal({
      title: 'Xoá',
      text: "Bạn có chắc la muốn xoá",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Quay lại'
    })
  }

  async alertCannotDelete() {
    return await swal({
      title: 'Không thể xoá',
      type: 'warning',
      timer: 1000,
    });
  }

  async alertDeleteSuccess() {
    return await swal({
      title: 'Xoá thành công',
      type: 'success',
      timer: 1000,
    });
  }

  async deleteItem(item) {
    item.deleting = true;
    try {
      try { await this.confirmDelete() } catch (err) { return };
      await this.innowayApi.promotion.delete(item.id)
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      this.alertCannotDelete();
    } finally {
      item.deleting = false;
    }
  }

  async deleteAll() {
    if (this.itemsTable.selectedRows.length == 0)
      return;

    let rows = this.itemsTable.selectedRows;
    let ids = [];
    rows.forEach(row => {
      row.item.deleting = true;
      ids.push(row.item.id);
    });
    try {
      try { await this.confirmDelete() } catch (err) { return };
      await this.innowayApi.promotion.deleteAll(ids)
      this.itemsTable.selectAllCheckbox = false;
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      this.alertCannotDelete();
    } finally {
      rows.forEach(row => {
        row.item.deleting = false;
      });
    }
  }

  onSearch(e) {
    const key = e.target.value;
    if (this.searchRef) clearTimeout(this.searchRef);
    this.searchRef = setTimeout(() => {
      this.query.filter = {
        $or: {
          code: { $iLike: `%${key}%` },
        }
      }
      this.getItems();
    }, this.searchTimeOut);
  }

  getNamePromotionType(code: string): string {
    let output = this.globals.detectPromotionTypeByCode(code);
    return output ? output.name : "";
  }

  getValuePromotion(value: string, code: string): string {
    let output = null;
    let promotionType = this.globals.detectPromotionTypeByCode(code);
    switch (promotionType) {
      case this.globals.PROMOTION_TYPES[0]:
        output = this.transformMoney(value);
        break;
      case this.globals.PROMOTION_TYPES[1]:
        output = this.transformPercent(value);
        break;
    }
    return output ? output : "";
  }

  transformMoney(value: any, options = {}) {
    var number: number;
    options = Object.assign({
      symbol: "đ",
      decimal: ",",
      thousand: ".",
      precision: 0,
      format: "%v %s"
    }, options);
    try {
      if (typeof (value) === "string") {
        number = parseFloat(value);
      } else if (typeof (value) === "number") {
        number = value;
      }
      return accounting.formatMoney(number, options);
    } catch (err) {
      return "NAN";
    }
  }

  transformPercent(value: any, options = {}) {
    var number: number;
    options = Object.assign({
      symbol: "%",
      decimal: ",",
      thousand: ".",
      precision: 0,
      format: "%v %s"
    }, options);
    try {
      if (typeof (value) === "string") {
        number = parseFloat(value);
      } else if (typeof (value) === "number") {
        number = value;
      }
      return accounting.formatMoney(number, options);
    } catch (err) {
      return "NAN";
    }
  }

  async viewItem(item) {
    try {
      let response = await this.innowayApi.promotion.getDetailPromotion(item.id, {
        is_show_used_customer: true,
        is_show_used_bill: true,
      })
      console.log("detail", JSON.stringify(response))
    } catch (err) {
      console.log("detail", err)
    }
  }
}
