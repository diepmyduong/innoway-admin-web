import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ListPageInterface } from "app/apps/interface/listPageInterface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DataTable } from "angular-2-data-table-bootstrap4/dist";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { Globals } from './../../globals';
import {MatTooltipModule} from '@angular/material';
import { Subscription } from 'rxjs/Subscription'
import * as _ from 'lodash';
import * as moment from 'moment';

declare let swal:any

@Component({
  selector: 'app-bill',
  providers: [Globals],
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, ListPageInterface {
  items: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  itemCount: number = 0;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";
  itemFields: any = ["$all", {
    customer: ["phone", "fullname"],
    activities: ["action"],
    bill_ship_detail: ["fee", "received_time"],
    activity: ["action"]
  }];
  query: any = {};
  searchTimeOut: number = 250;
  searchRef: any;

  employeeData: any;

  branch: any;
  brand: any;

  @ViewChild('itemsTable') itemsTable: DataTable;
  subscriptions: Subscription[] = []

  constructor(
    private globals: Globals,
    private router: Router,
    private route: ActivatedRoute,
    public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef
  ) {
    this.employeeData = this.innowayApi.innowayAuth.innowayUser
  }

  ngOnInit() {
    this.subscriptions.push(this.innowayApi.bill.items.subscribe(items => {
      this.getItems()
    }))
    this.loadBranchByEmployeeData(this.employeeData.branch_id);
    this.loadBrandByEmployeeData(this.employeeData.brand_id);

    moment.locale('vi');
  }
  
    async loadBrandByEmployeeData(brandId: string) {
      try {
        this.brand = await this.innowayApi.brand.getItem(brandId, {
          local: true, reload: true, query: {
            fields: ["$all"]
          }
        })
        this.ref.detectChanges();
      } catch (err) {
  
      }
    }
  
    async loadBranchByEmployeeData(branchId: string) {
      try {
        this.branch = await this.innowayApi.branch.getItem(branchId, {
          local: true, reload: true, query: {
            fields: ["$all"]
          }
        })
        this.ref.detectChanges();
      } catch (err) {
  
      }
    }
  

  async reloadItems(params) {
    let { limit, offset, sortBy, sortAsc } = params;
    this.query.limit = limit;
    this.query.offset = offset;
    this.query.order = sortBy ? [_.flattenDeep([_.split(sortBy, '.'), sortAsc ? 'ASC' : 'DESC'])] : null;
    await this.getItems();
  }

  async getItems() {
    let query = Object.assign({
      fields: this.itemFields
    }, this.query);
    this.items.next(await this.innowayApi.bill.getList({ query }))
    this.itemCount = this.innowayApi.bill.pagination.totalItems
    this.ref.detectChanges();
    return this.items;
  }

  detectActionName(action): string {
    let result = "";
    result = this.globals.detectBillActivityByCode(action);
    return result;
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

  paidHistoryAction(item) {
    this.router.navigate(['../paid-list', item.id], { relativeTo: this.route });
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
      text: "Bạn có chắc là muốn xoá",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Quay lại'
    })
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
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
      await this.innowayApi.bill.delete(item.id)
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
      await this.innowayApi.bill.deleteAll(ids)
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

  async print(bill) {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    this.loadDetailedBill(bill.id, true, popupWin);

  }

  async loadDetailedBill(id: string, isPrint: boolean, popupWin: any) {
    try {
      let data = await this.innowayApi.bill.getItem(id, {
        query: {
          fields: ["$all", {
            items: ['$all', {
              product: ['$all', '$paranoid'],
              topping_values: ['$all', '$paranoid']
            }],
            bill_ship_detail: ["$all"],
          }]
        }
      })
      if (isPrint && data.items != null) {
        this.printBill(data, popupWin);
      }
    } catch (err) {
      this.alertItemNotFound()
      // alert(err);
    }
  }

  async printBill(data: any, popupWin: any) {
    
    let tableContent = "";
    let index = 0;
    data.items.forEach(item => {
      tableContent += "<tr class='small-text text-right'>";
      tableContent += '<td>' + (index++) + '</td>'; 
      tableContent += '<td>' + item.product.name + '</td>'; 
      tableContent += '<td>' + item.amount + '</td>'; 
      tableContent += '<td>' + this.addSpace(item.product_price) + '</td>'; 
      tableContent += '<td>' + this.addSpace(item.total_price) + '</td>'; 
      tableContent += '</tr>';
    });
    
    popupWin.document.write(`
            <html>
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">
                    <style>
                      @media print { body.receipt { width: 80mm, min-height: 500mm } } 
                        .receipt { width: 80mm; min-height: 500mm; font-family: sans-serif; color: #555; text-align: center;  }
                        .sheet { padding: 2.5mm; }
                        .text-center { }
                        .text-left { text-align: left }
                        .text-right { text-align: right }
                        .brand-name { font-size: 2mm; }
                        .logo { width: 80%; margin: auto; }
                        .normal-text { margin-left: 0.5mm; font-size: 3.5mm;}
                        .small-text { font-size: 3mm; }
                        .title { font-size: 5mm; font-weight: 600; }
                        .padding-3 { padding: 3mm; }
                        .padding-4 { padding: 4mm; }
                        .left { float: left }
                        .right { float: right }
                        th { color: #444; border-bottom: dashed 1px;  }
                        td { color: #777 }
                        th, td { padding-top: 2mm; padding-bottom: 2mm; }
                    </style>
                </head>
                <body onload="window.print();window.close()" class="receipt">
                  <section class="sheet">
                    <img class='logo padding-3' src='` + this.brand.logo +`'>
                    <div class='text-center normal-text padding-3'>` + this.branch.address + `</div>
                    <div class='text-center normal-text'>Hotline: ` + this.branch.phone + `</div>

                    <hr style="border: none; border-top: solid 1px;" />
                    
                    <div style="display: inline-block; width: 100%;">
                      <div class='small-text left'>Ngày đặt: ` + moment(data.created_at).format('L') + `</div>
                      <div class='small-text text-right right'>Ngày nhận: ` + moment().format('L') + `</div>
                    </div>

                    <div class='title padding-4'>Phiếu thanh toán</div> 

                    <div class='normal-text text-left'>Mã đơn hàng: ` + data.id +`</div>
                    <div class='normal-text text-left'>Nhân viên giao hàng: Uy Minh</div>

                    <hr style="border: none; border-top: dashed 1px;" />
                    <table style="width:100%">
                      <tr class='small-text text-right'>
                        <th>TT</th>
                        <th>Tên sản phẩm</th> 
                        <th>SL</th>
                        <th>Đơn giá</th>
                        <th>T. Tiền</th>
                      </tr>
                      ` + tableContent + `
                    </table>
                    <hr style="border: none; border-top: dashed 1px;" />
                    <div style="padding-bottom: 1.5mm; display: inline-block; width: 100%;">
                      <div class='small-text left'>Phí ship</div>
                      <div class='small-text right'>` + this.addSpace(data.bill_ship_detail.fee) + `</div>
                    </div>
                    <div style="padding-bottom: 1.5mm; display: inline-block; width: 100%;">
                      <div class='small-text left'>Phí VAT</div>
                      <div class='small-text right'>` + this.addSpace(data.vat_fee) + `</div>
                    </div>
                    <hr style="border: none; border-top: solid 1px;" />
                    <div style="margin: 3mm 0mm">
                      <div class='normal-text left'><b>Thành tiền</b></div>
                      <div class='normal-text right'><b>` + this.addSpace(data.total_price) + 'đ' + `</b></div>
                    </div>
                    <div style="min-height: 15mm">
                    </div>
                  </section>
                </body>
            </html>`
    );
    popupWin.document.close();
  }
  
    addSpace(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  changeDateFormat(time, format) {
    if (!time)
      return; 

    if (format)
    {
      return moment(time).format(format);
    }
    return moment(time).format('L');
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
