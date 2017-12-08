import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InnowayService } from 'app/services'
import { InnowayApiService } from 'app/services/innoway'
import { DataTable } from 'angular-2-data-table-bootstrap4';
import { Subscription } from 'rxjs/Subscription'
declare let swal:any

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public innoway: InnowayService,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService
  ) {
    this.productService = innoway.getService('product');
  }

  private productService: any;
  public items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public itemCount = 0; // item total  count
  public thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";
  public itemFields = ["$all", {
    category: ["name"],
    product_type: ["name"],
    unit: ["name"]
  }];

  public query: any = {}
  public searchTimeOut = 250;
  public searchRef: any;
  subscriptions: Subscription[] = []

  @ViewChild(DataTable) itemsTable;

  ngOnInit() {
    this.subscriptions.push(this.innowayApi.product.items.subscribe(items => {
      this.items.next(items)
    }))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
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
    // this.items = await this.innoway.getAll('product', query);
    this.items.next(await this.innowayApi.product.getList({local: true, query }))
    this.itemCount = this.innowayApi.product.pagination.totalItems
    // this.itemCount = this.productService.currentPageCount;
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
      await this.productService.delete(item.id)
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
      await this.productService.deleteAll(ids)
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
