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

declare let swal:any;

@Component({
  selector: 'app-topping-type',
  templateUrl: './topping-type.component.html',
  styleUrls: ['./topping-type.component.scss']
})

export class ToppingTypeComponent implements OnInit, ListPageInterface {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";;
  itemFields: any = ["$all"];
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
    this.toppingTypeService = innoway.getService('topping');
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
    this.items = await this.innoway.getAll('topping', query);
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
    this.router.navigate(['/topping-type/add']);
  }

  editItem(item) {
    this.router.navigate(['/topping-type/add', item.id]);
  }

  viewItem(item) {
    this.router.navigate(['/topping-type/detail', item.id]);
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






  // public data: Array<any> = null;
  // public canLoadMore: boolean;
  // public limit: number;
  // public isMultipleSelect: boolean;
  // public seletectedItems: string[];
  // public searchName: string;
  // public numberOfItem: number;
  // public numberOfPage: number;
  // public pageOptions: number[];
  // public currentPageOption: number;
  // public defaultThumb: string;
  // public loadDataMode: number;
  // public notificationOption: any;
  //
  // isSelectItems: boolean;
  //
  // private form: FormGroup;
  // private toppingService: any;
  //
  // constructor(public innoway: InnowayService,
  //   private modal: Modal,
  //   private pageService: PageService,
  //   private zone: NgZone,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private notificationService: NotificationsService,
  //   private ref: ChangeDetectorRef,
  //   private vcRef: ViewContainerRef) {
  //
  //   //config default
  //   this.pageOptions = [10, 20, 50, 100, 200];
  //   this.limit = 10;
  //   this.seletectedItems = [];
  //   this.canLoadMore = false;
  //   this.isMultipleSelect = false;
  //   this.defaultThumb = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";
  //
  //   //config notification
  //   this.notificationOption = {
  //     position: ["top", "right"],
  //     timeOut: 1000,
  //     lastOnBottom: true,
  //   };
  //
  //   //config form
  //   this.form = new FormGroup({
  //     pageOptionInput: new FormControl('', null),
  //     searchNameInput: new FormControl('', null),
  //   });
  //   this.form.controls["pageOptionInput"].setValue(this.pageOptions[0]);
  //
  //   //config modal
  //   modal.overlay.defaultViewContainer = vcRef;
  //
  //   //add topping service
  //   this.toppingService = innoway.getService('topping');
  // }
  //
  // ngOnInit(): void {
  //   this.loadData({
  //     fields: ["name","status"]
  //   });
  // }
  //
  // async loadData(query:any = {}) {
  //   try {
  //     console.log('query',query);
  //     //call api
  //     let items = await  this.innoway.getAll('topping', query);
  //     items.subscribe(toppings =>{
  //       this.data = toppings;
  //       console.log("toppings",this.data);
  //       //update UI
  //       this.ref.detectChanges();
  //     })
  //
  //   } catch (err) {
  //     console.log("error: " + err);
  //     this.pushNotification("Error!", "Cập nhật dữ liệu bị lỗi", -1);
  //     this.router.navigate(['/dashboard']);
  //   }
  // }
  //
  // addItem() {
  //   this.router.navigate(['/topping-type/add']);
  // }
  //
  // editItem(id: string) {
  //   this.router.navigate(['/topping-type/add', id]);
  // }
  //
  // viewItem(id: string) {
  //   this.router.navigate(['/topping-type/detail', id]);
  // }
  //
  // deleteOneItem(id: string) {
  //   let ids: string[] = [];
  //   ids.push(id);
  //   this.deleteItem(ids, ids.length - 1);
  // }
  //
  // async deleteItem(ids: string[], index: number) {
  //   try {
  //
  //     //update UI
  //     this.data.forEach((item1, index1: number) => {
  //       if (item1.id == ids[index]) {
  //         this.removeItemByIndex(index1);
  //         return;
  //       }
  //     });
  //
  //     this.seletectedItems.forEach((item1, index1: number) => {
  //       if (item1 == ids[index]) {
  //         this.removeSelectedItemByIndex(index1);
  //         return;
  //       }
  //     });
  //
  //     //call api
  //     await this.toppingService.delete(ids[index]);
  //
  //     //push notification
  //     this.pushNotification("Success", "Xóa thành công!", 0);
  //     this.ref.detectChanges();
  //
  //     //delete more items
  //     ids = ids.filter((item1, index1) => index1 !== index);
  //     index--;
  //     if (index > -1) {
  //       this.deleteItem(ids, index);
  //     }
  //   } catch (err) {
  //     this.pushNotification("Error!", "Xóa dữ liệu bị lỗi", -1);
  //     this.ref.detectChanges();
  //   }
  // }
  //
  // deleteSelectedItem() {
  //   this.deleteItem(this.seletectedItems, this.seletectedItems.length - 1);
  //   this.ref.detectChanges();
  // }
  //
  // removeItemByIndex(index: number) {
  //   this.data = this.data.filter((item1, index1) => index1 !== index);
  // }
  //
  // removeSelectedItemByIndex(index: number) {
  //   this.seletectedItems = this.seletectedItems.filter((item1, index1) => index1 !== index);
  // }
  //
  // selectAllItem() {
  //   this.seletectedItems = [];
  //   this.data.forEach((item: any) => {
  //     this.seletectedItems.push(item.id);
  //   });
  // }
  //
  // deselectAllItem() {
  //   this.seletectedItems = [];
  // }
  //
  // queryName() {
  //   throw new Error('Method not implemented.');
  // }
  //
  // loadMore() {
  //   throw new Error('Method not implemented.');
  // }
  //
  // pagination() {
  //   throw new Error('Method not implemented.');
  // }
  //
  // switchModeSelectItem(event: any) {
  //   this.isMultipleSelect = event;
  // }
  //
  // pushNotification(title, content, type: number) {
  //   switch (type) {
  //     case -1: {
  //       this.notificationService.alert(
  //         title.toString(),
  //         content.toString(),
  //         {
  //           showProgressBar: true,
  //           pauseOnHover: false,
  //           clickToClose: false,
  //         }
  //       )
  //       break;
  //     }
  //     case 0: {
  //       this.notificationService.success(
  //         title.toString(),
  //         content.toString(),
  //         {
  //           showProgressBar: true,
  //           pauseOnHover: false,
  //           clickToClose: false,
  //         }
  //       )
  //       break;
  //     }
  //     default: {
  //       this.notificationService.success(
  //         title.toString(),
  //         content.toString(),
  //         {
  //           showProgressBar: true,
  //           pauseOnHover: false,
  //           clickToClose: false,
  //         }
  //       )
  //     }
  //   }
  // }
}
