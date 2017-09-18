import { Component, OnInit, NgZone, ChangeDetectorRef, ViewContainerRef, ViewChild } from '@angular/core';

import { Modal } from "angular2-modal/plugins/bootstrap";
import { NotificationsService } from "angular2-notifications";
import { ListPageInterface } from './../interface/listPageInterface';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ng2-validation/dist";
import { InnowayService } from 'app/services'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataTable } from "angular-2-data-table-bootstrap4";

declare let swal: any;

@Component({
  selector: 'app-topping',
  templateUrl: './topping.component.html',
  styleUrls: ['./topping.component.scss']
})

export class ToppingComponent implements OnInit, ListPageInterface {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";;
  itemFields: any = ["$all", {
    topping: ["name"]
  }];
  query: any = {};
  searchTimeOut: number = 250;
  searchRef: any;

  toppingTypeService: any;

  @ViewChild(DataTable) itemsTable;

  constructor(
    private router: Router,
    public innoway: InnowayService,
    private ref: ChangeDetectorRef
  ) {
    this.toppingTypeService = innoway.getService('topping_value');
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
    this.items = await this.innoway.getAll('topping_value', query);
    this.itemCount = this.toppingTypeService.currentPageCount;
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
    this.router.navigate(['/topping/add']);
  }

  editItem(item) {
    this.router.navigate(['/topping/add', item.id]);
  }

  viewItem(item) {
    this.router.navigate(['/topping/detail', item.id]);
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
      await this.toppingTypeService.delete(item.id)
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      this.alertCannotDelete();
    } finally {
      item.deleting = false;
    }
  }

  async deleteAll() {
    let rows = this.itemsTable.selectedRows;
    let ids = [];
    rows.forEach(row => {
      row.item.deleting = true;
      ids.push(row.item.id);
    });
    try {
      try { await this.confirmDelete() } catch (err) { return };
      await this.toppingTypeService.deleteAll(ids)
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
          name: { $iLike: `%${key}%` },
          description: { $iLike: `%${key}%` },
        }
      }
      this.getItems();
    }, this.searchTimeOut);
  }

}
