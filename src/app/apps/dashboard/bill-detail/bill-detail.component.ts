import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InnowayService } from "app/services";
import * as moment from 'moment';

import { Globals } from './../../../globals';
declare let swal:any

@Component({
  selector: 'app-bill-detail',
  providers: [Globals],
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailComponent implements OnInit {

  billService: any;
  billActitivyService: any;

  id: string;
  item: any = {};
  itemFields: any = ['$all', {
    activities: ['$all', {
      employee: ['$all']
    }],
    bill_ship_detail: ['$all'],
    items: ['$all', {
      product: ['$all','$paranoid'],
      topping_values: ['$all','$paranoid']
    }],
    customer: ['$all']
  }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService,
    private globals: Globals,
  ) {
    this.billService = innoway.getService('bill');
    this.billActitivyService = innoway.getService('bill_activity');
  }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    console.log('bill detail',this.id)
    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async loadBillData(query) {

  }

  viewBillDetail(id: string) {

  }

  pushNotification(type, content) {

  }

  async setData() {
    try {
      this.item = await this.billService.get(this.id, {
        fields: this.itemFields
      });
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  backToList() {
    this.router.navigate(['./bills'], { relativeTo: this.route.parent });
  }

  detectChannelName(channel): string {
    let result = "";
    result=this.globals.detectChannelByCode(channel);
    return result;
  }

  detectActionName(action): string {
    let result = "";
    result=this.globals.detectBillActivityByCode(action);
    return result;
  }

  async changeStatusBill(bill) {

    let options = [
      { '-2': 'Chỉnh sửa' },
      { '-1': ' Đã hủy' },
      { '0': 'Đặt hàng thành công' },
      { '1': 'Đang điều phối' },
      { '2': 'Đang xử lý' },
      { '3': 'Đã chuẩn bị' },
      { '4': 'Đã chuyển cho giao hàng' },
      { '5': 'Đang giao' },
      { '6': 'Đã thanh toán' },
      { '7': 'Đã thu tiền' }
    ];

    let avaiavle_options = {};

    options.forEach(option => {
      if (Object.keys(option) > bill.activities[bill.activities.length - 1].action) {
        avaiavle_options = $.extend(avaiavle_options, option);
      }
    });

    let result = await swal({
      title: 'Chọn trạng thái',
      input: 'select',
      inputOptions: avaiavle_options,
      inputPlaceholder: 'Chọn trạng thái',
      showCancelButton: true
    })

    await swal({
      type: 'success',
      html: 'Cập nhật trạng thái: ' + this.detectActionName(result)
    })
    this.updateAction(Number.parseInt(result));
  }

  async updateAction(action: number) {
    try {
      let bill_id = this.item.id;
      let employee_id;
      await this.billActitivyService.add({ bill_id, action })
      this.alertAddSuccess();
      this.item = {};
      this.setData();
    }
    catch (err) {
      this.alertAddFailed();
    }
  }

  viewLocationBillDetail() {
    this.router.navigate(['./bill-location/', this.id], { relativeTo: this.route.parent });
  }

  editBill() {

  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  alertAddSuccess() {
    return swal({
      title: 'Cập nhật thành công',
      type: 'success',
      timer: 2000,
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    })
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    })
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    })
  }
}
