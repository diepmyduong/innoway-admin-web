import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InnowayApiService } from 'app/services/innoway'
import { DataTable } from 'angular-2-data-table-bootstrap4';
import { Subscription } from 'rxjs/Subscription'
declare let swal: any

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService
  ) {
  }
  search_text: any = ''
  selectedCategory: any = ''
  public categories: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
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
  loadDone = false
  // subscriptions: Subscription[] = []

  @ViewChild('itemsTable') itemsTable: DataTable;

  @ViewChild("fileImportUploader")
  fileImportUploader: ElementRef;

  subscriptions:any = {}

  async ngOnInit() {
    await this.loadCategoryData()
    this.subscriptions.onItemsChange = this.innowayApi.smartCode.items.subscribe(items => {
      if(items)  this.itemsTable.reloadItems()
    })
  }

  ngAfterViewDestroy() {
    this.subscriptions.forEach(s => {
      s.unsubscribe()
    })
  }

  async loadCategoryData() {
    try {
      this.categories.next(await this.innowayApi.productCategory.getList({
        local: false, query: {
          fields: ["id", "name"],
          limit: 0
        }
      }))
      this.ref.detectChanges()
    } catch (err) {
      console.error('Cannot load category', err);
    }
  }

  async changeCategory() {
    
    this.getItems();
  }

  // ngOnDestroy() {
  //   this.subscriptions.forEach(subscription => {
  //     subscription.unsubscribe()
  //   })
  // }

  async reloadItems(params) {
    let { limit, offset, sortBy, sortAsc } = params;
    this.query.limit = limit;
    this.query.offset = offset;
    this.query.order = sortBy ? [[sortBy, sortAsc ? 'ASC' : 'DESC']] : null;
    await this.getItems();
  }

  async getItems() {
    this.loadDone = false

    this.query.filter = {}
    this.query.filter.name_vi = { $iLike: "%" + this.convertViToEng(this.search_text) + "%" }
    if (this.selectedCategory) {
      this.query.filter.category_id = this.selectedCategory
    }

    let query = Object.assign({
      fields: this.itemFields
    }, this.query);
    console.log("bibi: " + JSON.stringify(query));
    let list = await this.innowayApi.product.getList({ query })
    list.forEach(p => {
      if (!p.category) {
        p.category = this.categories.getValue().find(x => x.id == p.category_id)
      }
    })
    this.items.next(await this.innowayApi.product.getList({ query }))
    this.itemCount = this.innowayApi.product.pagination.totalItems
    this.ref.detectChanges();
    console.log('items', this.items.getValue()[0])
    this.loadDone = true

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
      // try { await this.confirmDelete() } catch (err) { return };
      console.log("deleteItem", JSON.stringify(item))
      console.log("deleteItem", JSON.stringify(item.id))
      await this.innowayApi.product.delete(item.id)
      this.itemsTable.reloadItems();
      this.alertDeleteSuccess();
    } catch (err) {
      console.log("deleteItem", err);
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
      try { await this.confirmDelete() } catch (err) {
        console.log("deleteAll", err)
        return
      };

      console.log("deleteAll", JSON.stringify(ids));
      let data = await this.innowayApi.product.deleteAll(ids)
      console.log("deleteAll", JSON.stringify(data));
      this.itemsTable.selectAllCheckbox = false;
      this.alertDeleteSuccess();
    } catch (err) {
      console.log("deleteAll 1", err)
      this.alertCannotDelete();
    } finally {
      rows.forEach(row => {
        row.item.deleting = false;
      });
    }
  }

  onSearch(e) {
    this.getItems();
  }

  async export() {
    try {
      let response: any = await this.innowayApi.product.export()
      this.downloadFile(response)
    } catch (err) {
      console.log("export", err);
    }
  }

  downloadFile(data) {
    let blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "file-sản-phẩm.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  async import(event) {
    let files = this.fileImportUploader.nativeElement.files
    let file = files[0];
    console.log("onChangeImportFile", file);
    try {
      let response = await this.innowayApi.product.import(file, {
        mode: "overwrite"
      })
      window.location.reload();
      // this.upload(files)
      console.log("onChangeImportFile", response);
    } catch (err) {
      console.log("onChangeImportFile", err);
    }
  }

  convertViToEng(string) {
      let obj = {
          Đ: 'D', đ: 'd', â: 'a',
          ă: 'a', ê: 'e', ô: 'o', ơ: 'o',
          ư: 'u',
          á: 'a', à: 'a', ạ: 'a', ả: 'a', ã: 'a',
          ắ: 'a', ằ: 'a', ặ: 'a', ẳ: 'a', ẵ: 'a',
          ấ: 'a', ầ: 'a', ậ: 'a', ẩ: 'a', ẫ: 'a',
          é: 'e', è: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
          ế: 'e', ề: 'e', ể: 'e', ễ: 'e', ệ: 'e',
          ý: 'y', ỳ: 'y', ỵ: 'y', ỷ: 'y', ỹ: 'y',
          ú: 'u', ù: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
          ứ: 'u', ừ: 'u', ử: 'u', ữ: 'u', ự: 'u',
          í: 'i', ì: 'i', ị: 'i', ỉ: 'i', ĩ: 'i',
          ó: 'o', ò: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
          ố: 'o', ồ: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
          ớ: 'o', ờ: 'o', ở: 'o', ỡ: 'o', ợ: 'o'
      }
  
      string = string.trim();
      string = string.toLowerCase();
  
      let arr = string.split('');
  
      for (let i in arr) {
          if (obj[arr[i]]) {
              arr[i] = obj[arr[i]];
          }
      }
  
      return arr.join('');
  }
}
