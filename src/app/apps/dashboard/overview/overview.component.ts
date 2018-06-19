import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { InnowayApiService } from "app/services/innoway";
declare let swal: any
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  top_right_infos = [];

  sub_header_infos = [];

  summary: any = {};

  constructor(public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef, ) {

  }

  ngOnInit() {
    this.loadDailySummary();
  }

  async getSummaryInformation() {
    try {
      let data = await this.innowayApi.bill.summaryBill({
        startTime: moment(Date.now()).format("YYYY-MM-DD"),
        endTime: moment(Date.now()).add(1, 'days').format('YYYY-MM-DD')
      })

      console.log("summary", JSON.stringify(data));
      this.summary = data;

      this.top_right_infos.push({
        number: data.total_of_pay_amount,
        text: "Tiền đã thu"
      });

      this.top_right_infos.push({
        number: data.total_of_remain_amount,
        text: "Tiền còn thiếu"
      });

      this.sub_header_infos.push({
        number: data.number_of_bill_sent_successfully,
        text: 'THÀNH CÔNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_processing,
        text: 'ĐANG XỬ LÝ',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_prepared,
        text: 'ĐÃ CHUẨN BỊ',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_delivering,
        text: 'ĐANG GIAO',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_paid,
        text: 'THÀNH CÔNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_cancel,
        text: 'ĐÃ HỦY',
      })

      // this.top_right_infos.push({
      //
      // });
      // alert(JSON.stringify(data));
    } catch (err) {

    }
  }

  async loadDailySummary() {
    try {
      let response: any = await this.innowayApi.dailySummary.getList({
        query: {
          fields: ["$all"],
          filter: {
            date: { $eq: moment(Date.now()).format("DD-MM-YYYY") }
          }
        }
      })

      console.log("daily summary", JSON.stringify(response));
      let data = response[0] ? response[0] : {};
      this.summary = data;
      this.top_right_infos = [];
      this.sub_header_infos = [];

      this.top_right_infos.push({
        number: data.pay_amount ? data.pay_amount : 0,
        text: "Tiền đã thu"
      });

      this.top_right_infos.push({
        number: data.remain_amount ? data.remain_amount : 0,
        text: "Tiền còn thiếu"
      });

      this.top_right_infos.push({
        number: data.number_of_customer ? data.number_of_customer : 0,
        text: "Số khách hàng"
      });

      this.top_right_infos.push({
        number: data.number_of_customer_using_promotion ? data.number_of_customer_using_promotion : 0,
        text: "Số khuyến mãi được dùng"
      });

      this.top_right_infos.push({
        number: data.number_of_bill ? data.number_of_bill : 0,
        text: "Số đơn hàng"
      });

      this.sub_header_infos.push({
        number: data.number_of_sent_successfully_status ? data.number_of_sent_successfully_status : 0,
        text: 'THÀNH CÔNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_distributed_status ? data.number_of_distributed_status : 0,
        text: 'ĐÃ ĐIỀU PHỐI',
      })

      this.sub_header_infos.push({
        number: data.number_of_waiting_for_confirmation_status ? data.number_of_waiting_for_confirmation_status : 0,
        text: 'ĐANG CHỜ XÁC NHẬN',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_confirmed_status ? data.number_of_bill_confirmed_status : 0,
        text: 'ĐÃ XÁC NHẬN',
      })

      this.sub_header_infos.push({
        number: data.number_of_picking_up_status ? data.number_of_picking_up_status : 0,
        text: 'ĐANG LẤY HÀNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_received_status ? data.number_of_received_status : 0,
        text: 'ĐÃ NHẬN HÀNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_processing_status ? data.number_of_processing_status : 0,
        text: 'ĐANG XỬ LÝ',
      })

      this.sub_header_infos.push({
        number: data.number_of_prepared_status ? data.number_of_prepared_status : 0,
        text: 'ĐÃ CHUẨN BỊ',
      })

      this.sub_header_infos.push({
        number: data.number_of_sent_shipper_status ? data.number_of_sent_shipper_status : 0,
        text: 'ĐÃ GỬI GIAO HÀNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_delivering_status ? data.number_of_delivering_status : 0,
        text: 'ĐANG GIAO',
      })

      this.sub_header_infos.push({
        number: data.number_of_paid_status ? data.number_of_paid_status : 0,
        text: 'ĐÃ THANH TOÁN',
      })

      this.sub_header_infos.push({
        number: data.number_of_collected_money_status ? data.number_of_collected_money_status : 0,
        text: 'ĐÃ NHẬN TIỀN',
      })

      this.sub_header_infos.push({
        number: data.number_of_cancelled_status ? data.number_of_cancelled_status : 0,
        text: 'ĐÃ HỦY',
      })

      this.ref.detectChanges();
    } catch (err) {
      console.log("bi-summary", err)
    }
  }

}
