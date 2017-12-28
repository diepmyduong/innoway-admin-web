import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ListPageInterface } from "app/apps/interface/listPageInterface";
import { DataTable } from "angular-2-data-table-bootstrap4/dist";
import { Router, ActivatedRoute } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { Globals } from "./../../Globals"
declare let swal: any
declare var accounting:any;

@Component({
  selector: 'app-customer',
  providers: [Globals],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, ListPageInterface {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";;
  itemFields: any = ["$all"];
  query: any = {};
  searchTimeOut: number = 250;
  searchRef: any;

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
  }

  async reloadItems(params) {
    let { limit, offset, sortBy, sortAsc } = params;
    this.query.limit = limit;
    this.query.offset = offset;
    this.query.order = sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : null;
    await this.getItems();
  }

  async getItems() {
    let query = Object.assign({
      fields: this.itemFields
    }, this.query);
    console.log("bibi: " + JSON.stringify(query));
    this.items.next(await this.innowayApi.customer.getList({ query }))
    this.itemCount = this.innowayApi.customer.pagination.totalItems
    this.items.subscribe(items => console.log(items))
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

  viewItem(item) {
    this.router.navigate(['../detail', item.id], { relativeTo: this.route });
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
      await this.innowayApi.customer.delete(item.id)
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
      await this.innowayApi.customer.deleteAll(ids)
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
          fullname: { $iLike: `%${key}%` },
          phone: { $iLike: `%${key}%` },
        }
      }
      this.getItems();
    }, this.searchTimeOut);
  }
}
