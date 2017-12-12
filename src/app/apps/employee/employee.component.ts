import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ListPageInterface } from "app/apps/interface/listPageInterface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataTable } from "angular-2-data-table-bootstrap4/dist";
import { Router, ActivatedRoute } from "@angular/router";
import { InnowayService } from "app/services";
import { MatDialog } from '@angular/material';
import { ChangePasswordDialog } from "./../../modal/change-password/change-password.component";
import { ModalModule } from './../../modal/modal.module';

declare let swal: any

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, ListPageInterface {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";;
  itemFields: any = ["$all", {
    branch: ["$all"]
  }];
  query: any = {};
  searchTimeOut: number = 250;
  searchRef: any;

  employeeService: any;

  @ViewChild('itemsTable') itemsTable: DataTable;

  constructor(
    private router: Router,
    public innoway: InnowayService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    this.employeeService = innoway.getService('employee');
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
    this.items = await this.innoway.getAll('employee', query);
    this.itemCount = this.employeeService.currentPageCount;
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
      await this.employeeService.delete(item.id)
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
      await this.employeeService.deleteAll(ids)
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

  showChangePasswordDialog(item) {

    let data = {
      title: "Đổi mật khẩu nhân viên",
      button_yes: "Cập nhật",
      button_no: "Bỏ qua",
      inputs: [
        {
          title: "Mật khẩu",
          property: "password",
          type: "text",
        },
        {
          title: "Xác nhận mật khẩu",
          property: "repassword",
          type: "text",
        }
      ]
    };

    let dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changePassword(item, result.password);
      }
    })
  }

  async changePassword(data: any, password) {
    try {
      await this.employeeService.update(data.id, { password })
    } catch (err) {
    }
  }
}
