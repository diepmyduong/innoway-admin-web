import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import * as moment from 'moment';
import { Globals } from "./../../../globals";
import { InnowayApiService } from "app/services/innoway";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { MapsAPILoader } from "@agm/core";

declare var swal: any

@Component({
  selector: 'app-message-setting',
  providers: [Globals],
  templateUrl: './message-setting.component.html',
  styleUrls: ['./message-setting.component.scss']
})
export class MessageSettingComponent implements OnInit {

  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;

  is_sent_successfully_status: boolean = true
  sent_successfully_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái gửi thành công'
  is_auto_send_sent_successfully_content: boolean = true

  is_distributed_status: boolean = true
  distributed_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đã điều phối'
  is_auto_send_distributed_content: boolean = true

  is_waiting_for_confirmation_status: boolean = true
  waiting_for_confirmation_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái chờ xác nhận'
  is_auto_send_waiting_for_confirmation_content: boolean = true

  is_confirmed_status: boolean = true
  confirmed_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đã xác nhận'
  is_auto_send_confirmed_content: boolean = true

  is_picking_up_status: boolean = true
  picking_up_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đang lấy hàng'
  is_auto_send_picking_up_content: boolean = true

  is_received_status: boolean = true
  received_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đã nhận hàng'
  is_auto_send_received_content: boolean = true

  is_prepared_status: boolean = true
  prepared_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đã chuẩn bị'
  is_auto_prepared_content: boolean = true

  is_sent_shipper_status: boolean = true
  sent_shipper_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái gửi giao hàng'
  is_auto_send_sent_shipper_content: boolean = true

  is_delivering_status: boolean = true
  delivering_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đang giao hàng'
  is_auto_send_delivering_content: boolean = true

  is_paid_status: boolean = true
  paid_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đã thanh toán'
  is_auto_send_paid_content: boolean = true

  is_collected_money_status: boolean = true
  collected_money_content: string = 'Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đã thu tiền'
  is_auto_send_collected_money_content: boolean = true

  is_auto_send_receipt: boolean = true
  send_receipt_content: string = "Đây là thông tin hoá đơn của bạn"
  auto_send_receipt_activity: boolean = true

  is_processing_status: boolean = true
  processing_content: string = "Chào {{first_name}} {{last_name}} đơn hàng {{_meta.code}} bạn vừa chuyển sang trạng thái đang xử lý"
  is_auto_send_processing_content: boolean = true

  meta_data: any = JSON.stringify({
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Image",
        "payload": "{\"type\":\"story\", \"data\":\"123445\"}"
      },
      {
        "content_type": "text",
        "title": "Png",
        "payload": "{\"type\":\"story\", \"data\":\"123445\"}"
      },
      {
        "content_type": "text",
        "title": "Jpeg",
        "payload": "{\"type\":\"story\", \"data\":\"123445\"}"
      }
    ]
  })

  automationSetting: any

  botApp: string = null
  botApps: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innowayApi: InnowayApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {

  }


  ngOnInit() {
    this.getAllConnectedBotApp();
    this.loadData();
  }

  check_is_sent_successfully_status(event, data) {
    this.is_sent_successfully_status = !data
  }

  check_is_auto_send_sent_successfully_content(event, data) {
    this.is_auto_send_sent_successfully_content = !data
  }

  check_is_distributed_status(event, data) {
    this.is_distributed_status = !data
  }

  check_is_auto_send_distributed_content(event, data) {
    this.is_auto_send_distributed_content = !data
  }
  check_is_waiting_for_confirmation_status(event, data) {
    this.is_waiting_for_confirmation_status = !data
  }

  check_is_auto_send_waiting_for_confirmation_content(event, data) {
    this.is_auto_send_waiting_for_confirmation_content = !data
  }

  check_is_confirmed_status(event, data) {
    this.is_confirmed_status = !data
  }

  check_is_auto_send_confirmed_content(event, data) {
    this.is_auto_send_confirmed_content = !data
  }

  check_is_picking_up_status(event, data) {
    this.is_picking_up_status = !data
  }

  check_is_auto_send_picking_up_content(event, data) {
    this.is_auto_send_picking_up_content = !data
  }

  check_is_received_status(event, data) {
    this.is_received_status = !data
  }

  check_is_auto_send_received_content(event, data) {
    this.is_auto_send_received_content = !data
  }

  check_is_prepared_status(event, data) {
    this.is_prepared_status = !data
  }

  check_is_auto_prepared_content(event, data) {
    this.is_auto_prepared_content = !data
  }

  check_is_sent_shipper_status(event, data) {
    this.is_sent_shipper_status = !data
  }

  check_is_auto_send_sent_shipper_content(event, data) {
    this.is_auto_send_sent_shipper_content = !data
  }

  check_is_delivering_status(event, data) {
    this.is_delivering_status = !data
  }

  check_is_auto_send_delivering_content(event, data) {
    this.is_auto_send_delivering_content = !data
  }

  check_is_paid_status(event, data) {
    this.is_paid_status = !data
  }

  check_is_auto_send_paid_content(event, data) {
    this.is_auto_send_paid_content = !data
  }

  check_is_collected_money_status(event, data) {
    this.is_collected_money_status = !data
  }

  check_is_auto_send_collected_money_content(event, data) {
    this.is_auto_send_collected_money_content = !data
  }

  check_is_auto_send_receipt(event, data) {
    this.is_auto_send_receipt = !data
  }

  check_auto_send_receipt_activity(event, data) {
    this.auto_send_receipt_activity = !data
  }

  check_is_processing_status(event, data) {
    this.is_processing_status = !data
  }

  check_is_auto_send_processing_content(event, data) {
    this.is_auto_send_processing_content = !data
  }

  async loadData() {
    try {
       let response = await this.innowayApi.autoBillStatusSetting.getList({//this.automationSetting
        query: {
          fields: ["$all"],
          // filter: {
          //   brand_id: {
          //     $eq: this.innowayApi.innowayAuth.innowayUser.brand_id
          //   }
          // }
        }
      });
      console.log("loadData id",this.innowayApi.innowayAuth.innowayUser.brand_id)
      console.log("loadData", JSON.stringify(response))
      this.is_sent_successfully_status = this.automationSetting.is_sent_successfully_status
      this.sent_successfully_content = this.automationSetting.sent_successfully_content
      this.is_auto_send_sent_successfully_content = this.automationSetting.is_auto_send_sent_successfully_content
      this.is_distributed_status = this.automationSetting.is_distributed_status
      this.distributed_content = this.automationSetting.distributed_content
      this.is_auto_send_distributed_content = this.automationSetting.is_auto_send_distributed_content
      this.is_waiting_for_confirmation_status = this.automationSetting.is_waiting_for_confirmation_status
      this.waiting_for_confirmation_content = this.automationSetting.waiting_for_confirmation_content
      this.is_auto_send_waiting_for_confirmation_content = this.automationSetting.is_auto_send_waiting_for_confirmation_content
      this.is_confirmed_status = this.automationSetting.is_confirmed_status
      this.confirmed_content = this.automationSetting.confirmed_content
      this.is_auto_send_confirmed_content = this.automationSetting.is_auto_send_confirmed_content
      this.is_picking_up_status = this.automationSetting.is_picking_up_status
      this.picking_up_content = this.automationSetting.picking_up_content
      this.is_auto_send_picking_up_content = this.automationSetting.is_auto_send_picking_up_content
      this.is_received_status = this.automationSetting.is_received_status
      this.received_content = this.automationSetting.received_content
      this.is_auto_send_received_content = this.automationSetting.is_auto_send_received_content
      this.is_prepared_status = this.automationSetting.is_prepared_status
      this.prepared_content = this.automationSetting.prepared_content
      this.is_auto_prepared_content = this.automationSetting.is_auto_prepared_content
      this.is_sent_shipper_status = this.automationSetting.is_sent_shipper_status
      this.sent_shipper_content = this.automationSetting.sent_shipper_content
      this.is_auto_send_sent_shipper_content = this.automationSetting.is_auto_send_sent_shipper_content
      this.is_delivering_status = this.automationSetting.is_delivering_status
      this.delivering_content = this.automationSetting.delivering_content
      this.is_auto_send_delivering_content = this.automationSetting.is_auto_send_delivering_content
      this.is_paid_status = this.automationSetting.is_paid_status
      this.paid_content = this.automationSetting.paid_content
      this.is_auto_send_paid_content = this.automationSetting.is_auto_send_paid_content
      this.is_collected_money_status = this.automationSetting.is_collected_money_status
      this.collected_money_content = this.automationSetting.collected_money_content
      this.is_auto_send_collected_money_content = this.automationSetting.is_auto_send_collected_money_content
      this.is_auto_send_receipt = this.automationSetting.is_auto_send_receipt
      this.send_receipt_content = this.automationSetting.send_receipt_content
      this.auto_send_receipt_activity = this.automationSetting.auto_send_receipt_activity
      this.is_processing_status = this.automationSetting.is_processing_status
      this.processing_content = this.automationSetting.processing_content
      this.is_auto_send_processing_content = this.automationSetting.is_auto_send_processing_content
      this.meta_data = this.automationSetting.meta_data
    } catch (err) {

    }
  }

  setData() {

  }

  async updateItem(form: NgForm) {
    try {
      let { is_sent_successfully_status,
        sent_successfully_content,
        is_auto_send_sent_successfully_content,
        is_distributed_status,
        distributed_content,
        is_auto_send_distributed_content,
        is_waiting_for_confirmation_status,
        waiting_for_confirmation_content,
        is_auto_send_waiting_for_confirmation_content,
        is_confirmed_status,
        confirmed_content,
        is_auto_send_confirmed_content,
        is_picking_up_status,
        picking_up_content,
        is_auto_send_picking_up_content,
        is_received_status,
        received_content,
        is_auto_send_received_content,
        is_prepared_status,
        prepared_content,
        is_auto_prepared_content,
        is_sent_shipper_status,
        sent_shipper_content,
        is_auto_send_sent_shipper_content,
        is_delivering_status,
        delivering_content,
        is_auto_send_delivering_content,
        is_paid_status,
        paid_content,
        is_auto_send_paid_content,
        is_collected_money_status,
        collected_money_content,
        is_auto_send_collected_money_content,
        is_auto_send_receipt,
        send_receipt_content,
        auto_send_receipt_activity,
        is_processing_status,
        processing_content,
        is_auto_send_processing_content,
        meta_data } = this
      let employee = this.innowayApi.innowayAuth.innowayUser;
      await this.innowayApi.autoBillStatusSetting.update(this.automationSetting.id, {
        is_sent_successfully_status,
        sent_successfully_content,
        is_auto_send_sent_successfully_content,
        is_distributed_status,
        distributed_content,
        is_auto_send_distributed_content,
        is_waiting_for_confirmation_status,
        waiting_for_confirmation_content,
        is_auto_send_waiting_for_confirmation_content,
        is_confirmed_status,
        confirmed_content,
        is_auto_send_confirmed_content,
        is_picking_up_status,
        picking_up_content,
        is_auto_send_picking_up_content,
        is_received_status,
        received_content,
        is_auto_send_received_content,
        is_prepared_status,
        prepared_content,
        is_auto_prepared_content,
        is_sent_shipper_status,
        sent_shipper_content,
        is_auto_send_sent_shipper_content,
        is_delivering_status,
        delivering_content,
        is_auto_send_delivering_content,
        is_paid_status,
        paid_content,
        is_auto_send_paid_content,
        is_collected_money_status,
        collected_money_content,
        is_auto_send_collected_money_content,
        is_auto_send_receipt,
        send_receipt_content,
        auto_send_receipt_activity,
        is_processing_status,
        processing_content,
        is_auto_send_processing_content,
        meta_data
      })
      this.loadData()
    } catch (err) {

    }
  }

  async getAllConnectedBotApp() {
    try {
      this.botApps.next(await this.innowayApi.thirdpartyChatbot.getList({
        query: {
          local: false,
          fields: ["$all"],
          filter: {
            brand_id: { $eq: this.innowayApi.innowayAuth.innowayUser.brand_id }
          }
        }
      }))
      this.botApp = null;
      this.ref.detectChanges();
      console.log("bot app", JSON.stringify(this.botApps.getValue()))
    } catch (err) {
      console.log(err)
    }
  }

}
