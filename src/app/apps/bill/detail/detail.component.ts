import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from 'app/services/innoway'
import { Globals } from './../../../globals';
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MatDialog } from '@angular/material';
import { EditInfoDialog } from "../../../modal/edit-info/edit-info.component";
import * as moment from 'moment';
import * as _ from 'lodash';

declare let swal: any;

@Component({
  selector: 'app-detail',
  providers: [Globals],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  elRef: ElementRef;
  id: string;
  item: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  itemObject: any;
  itemFields: any = ['$all'];
  employee: any;
  employeeType: any;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";
  load_done: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  branch: any;
  brand: any;

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    elRef: ElementRef,
    private ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService,
    public dialog: MatDialog,
  ) {
    this.elRef = elRef;
    this.employee = this.innowayApi.innowayAuth.innowayUser
    console.log('employee',this.employee)
    console.log('innoway',this.innowayApi)
    this.setupUIFollowActor(this.employee);
  }

  private setupUIFollowActor(employee: any) {
    switch (employee.employee_type) {
      case this.globals.ACTORS[0].code: {//anonymous
        break;
      }
      case this.globals.ACTORS[1].code: {//customer
        break;
      }
      case this.globals.ACTORS[2].code: {//operator
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          activity: ['$all']
        }];
        break;
      }
      case this.globals.ACTORS[3].code: {//shipper
        break;
      }
      case this.globals.ACTORS[4].code: {//checker
        break;
      }
      case this.globals.ACTORS[5].code: {//manager
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          activity: ['$all']
        }];
        break;
      }
      case this.globals.ACTORS[6].code: {//admin
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          activity: ['$all']
        }];
        break;
      }
      case this.globals.ACTORS[7].code: {//super_admin
        this.itemFields = ['$all', {
          activities: ['$all', {
            employee: ['$all']
          }],
          bill_ship_detail: ['$all'],
          items: ['$all', {
            product: ['$all', '$paranoid'],
            topping_values: ['$all', '$paranoid']
          }],
          customer: ['$all'],
          activity: ['$all']
        }];
        break;
      }
      default: {
        break;
      }
    }
  }

  async ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }

    this.loadBranchByEmployeeData(this.employee.branch_id);
    this.loadBrandByEmployeeData(this.employee.brand_id);
  }

  async loadBrandByEmployeeData(brandId: string) {
    try {
      this.brand = await this.innowayApi.brand.getItem(brandId, {
        query: { fields: ["$all"] }
      })
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  async loadBranchByEmployeeData(branchId: string) {
    try {
      this.branch = await this.innowayApi.branch.getItem(branchId, {
        query: { fields: ["$all"] }
      })
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  async setData() {
    try {
      this.item.next(await this.innowayApi.bill.getItem(this.id, {
        query: { fields: this.itemFields }
      }))
      this.load_done.next(true);
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  printt() {
    let popupWin, printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    printContents = this.elRef.nativeElement.querySelector("#print_content").innerHTML;
    popupWin.document.write(`
            <html>
                <head>
                    <title>Print tab</title>
                </head>
                <body onload="window.print();window.close()">${printContents}
                </body>
            </html>`
    );
    popupWin.document.close();
  }

  editItem() {
    this.router.navigate(['../add', this.id], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  changeDateFormat(time, format) {
    if (!time)
      return;

    if (format) {
      return moment(time).format(format);
    }
    return moment(time).format('L');
  }

  async editInfo() {
    if (!this.load_done.getValue())
      return;

    let itemObject = this.item as any;
    let actions = this.globals.BILL_ACTIVITY_OPTIONS_OBJECT;

    let data = {
      inputs: [
        {
          title: "Họ và tên",
          property: "customer.fullname",
          type: "text",
          current: itemObject.customer.fullname,
        },
        {
          title: "Giá phụ",
          property: "vat_fee",
          type: "number",
          current: itemObject.vat_fee,
        },
        {
          title: "Hoạt động",
          property: "customer.activity.action",
          type: "select",
          current: itemObject.activity.action,
          options: actions
        },
        {
          title: "Họ và tên",
          property: "customer.fullname",
          type: "text",
          current: itemObject.customer.fullname,
        },
        {
          title: "Giá phụ",
          property: "vat_fee",
          type: "number",
          current: itemObject.vat_fee,
        },
        {
          title: "Hoạt động",
          property: "customer.activity.action",
          type: "select",
          current: itemObject.activity.action,
          options: actions
        },
      ]
    };

    let dialogRef = this.dialog.open(EditInfoDialog, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    })
  }

  async print(bill) {
    if (!this.load_done.getValue())
      return;

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

    console.log(data);

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
                      <img class='logo padding-3' src='` + this.brand.logo + `'>
                      <div class='text-center normal-text padding-3'>` + this.branch.address + `</div>
                      <div class='text-center normal-text'>Hotline: ` + this.branch.phone + `</div>

                      <hr style="border: none; border-top: solid 1px;" />

                      <div style="display: inline-block; width: 100%;">
                        <div class='small-text left'>Ngày đặt: ` + moment(data.created_at).format('L') + `</div>
                        <div class='small-text text-right right'>Ngày nhận: ` + moment().format('L') + `</div>
                      </div>

                      <div class='title padding-4'>Phiếu thanh toán</div>

                      <div class='normal-text text-left'>Mã đơn hàng: ` + data.id + `</div>
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

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
