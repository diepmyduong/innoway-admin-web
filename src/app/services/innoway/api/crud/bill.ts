import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription';
import { ActivityEnum } from './bill-activity'

export interface iBill extends iCrud {
  address?: string,
  bill_activity_id?: string,
  bill_ship_detail_id?: string,
  brand_id?: string,
  customer_id?: string,
  latitude?: number,
  longitude?: number,
  note?: string,
  promotion_id?: string,
  total_price?: number,
  bill_items_total_price?: number,
  channel?: 'at_store' | 'hot_line' | 'facebook' | 'chatbot' | 'website' | 'application',
  vat_fee?: number,
  current_paid_history_id?: string,
  code?: number,
}

export class Bill extends CrudAPI<iBill> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'bill')
    this.fcmSubscription = this.api.fcm.onMessage.subscribe(message => {
      this.log('fcm message ', message)
      if (message === undefined) return
      message.json.topic = message.topic

      switch (message.topic) {
        case 'order_at_store':
          this.onInformationBillFromFCM.next(message.json)
          break;
        case 'order_online_by_employee':
          this.onInformationBillFromFCM.next(message.json)
          break;
        case 'order_online_by_customer':
          this.onInformationBillFromFCM.next(message.json)
          break;
        case 'update_subfee':
          this.onInformationBillFromFCM.next(message.json)
          break;
        case 'update_paid_history':
          this.onInformationBillFromFCM.next(message.json)
          break;
        case 'cancel_bill':
          this.onInformationBillFromFCM.next(message.json)
          break;
        case 'change_bill_activity':
          this.onInformationBillFromFCM.next(message.json)
          break;
      }
      this.onInformationBillFromFCM.next(undefined)
    })
  }

  onBillChange = new BehaviorSubject<any>(undefined)
  onInformationBillFromFCM = new BehaviorSubject<any>(undefined)
  onBillOrderAtStore = new BehaviorSubject<any>(undefined)
  fcmSubscription: Subscription

  async subscribe() {
    const registrationToken = await this.api.fcm.getMessageToken()
    console.log("fcm", registrationToken)
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`subscribe`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { registration_token: registrationToken }
    }
    let res: any = await this.exec(setting);
    return this.onInformationBillFromFCM
  }

  async changeActivity(billId: string, params: any) {
    let setting: any = {
      method: 'POST',
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { employee_id: params.employeeId, note: params.note }
    }
    switch (params.activity) {
      case ActivityEnum.BILL_SENT_SUCCESSFULLY:
        setting.uri = this.apiUrl(`${billId}/activity/sentSuccessfullyBillStatus`);
        break;
      case ActivityEnum.BILL_DISTRIBUTED:
        setting.uri = this.apiUrl(`${billId}/activity/distributedBillStatus`);
        break;
      case ActivityEnum.BILL_WAITING_FOR_CONFIRMATION:
        setting.uri = this.apiUrl(`${billId}/activity/waitingForConfirmationBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_WAITING_FOR_CONFIRMATION:
        setting.uri = this.apiUrl(`${billId}/activity/waitingForConfirmationBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_WAITING_FOR_CONFIRMATION:
        setting.uri = this.apiUrl(`${billId}/activity/waitingForConfirmationBillStatus/cancelled`);
        break;
      case ActivityEnum.BILL_CONFIRMED:
        setting.uri = this.apiUrl(`${billId}/activity/confirmedBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_BILL_CONFIRMED:
        setting.uri = this.apiUrl(`${billId}/activity/confirmedBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_BILL_CONFIRMED:
        setting.uri = this.apiUrl(`${billId}/activity/confirmedBillStatus/cancelled`);
        break;
      case ActivityEnum.BILL_PICKING_UP:
        setting.uri = this.apiUrl(`${billId}/activity/pickingUpBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_PICKING_UP:
        setting.uri = this.apiUrl(`${billId}/activity/pickingUpBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_PICKING_UP:
        setting.uri = this.apiUrl(`${billId}/activity/pickingUpBillStatus/cancelled`);
        break;
      case ActivityEnum.BILL_RECEIVED:
        setting.uri = this.apiUrl(`${billId}/activity/receivedBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_RECEIVED:
        setting.uri = this.apiUrl(`${billId}/activity/receivedBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_RECEIVED:
        setting.uri = this.apiUrl(`${billId}/activity/receivedBillStatus/cancelled`);
        break;
      case ActivityEnum.BILL_PROCESSING:
        setting.uri = this.apiUrl(`${billId}/activity/processingBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_PROCESSING:
        setting.uri = this.apiUrl(`${billId}/activity/processingBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_PROCESSING:
        setting.uri = this.apiUrl(`${billId}/activity/processingBillStatus/deleted`);
        break;
      case ActivityEnum.BILL_PREPARED:
        setting.uri = this.apiUrl(`${billId}/activity/preparedBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_PREPARED:
        setting.uri = this.apiUrl(`${billId}/activity/preparedBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_PREPARED:
        setting.uri = this.apiUrl(`${billId}/activity/preparedBillStatus/cancelled`);
        break;
      case ActivityEnum.BILL_SENT_SHIPPER:
        setting.uri = this.apiUrl(`${billId}/activity/sentShipperBillStatus`);
        switch (params.type) {
          case "GHN": {
            setting.body = {
              employee_id: params.employeeId,
              note: params.note,
              type: "GHN",
              data: {
                pick_address: {
                  longitude: params.data.pick_address.longitude,
                  latitude: params.data.pick_address.latitude
                },
                receive_address: {
                  longitude: params.data.receive_address.longitude,
                  latitude: params.data.receive_address.latitude
                },
                total_weight: params.data.total_weight,
                note_code: params.data.note_code
              }
            }
            break;
          }
          case "GHTK": {
            setting.body = {
              employee_id: params.employeeId,
              note: params.note,
              type: "GHTK",
              data: {
                pick_address: {
                  longitude: params.data.pick_address.longitude,
                  latitude: params.data.pick_address.latitude
                },
                receive_address: {
                  longitude: params.data.receive_address.longitude,
                  latitude: params.data.receive_address.latitude
                },
                total_weight: params.data.total_weight,
                note_code: params.data.note_code
              }
            }
            break;
          }
          case "UBER_DELIVER": {
            setting.body = {
              employee_id: params.employeeId,
              note: params.note,
              type: "UBER_DELIVER",
              data: {
                pick_address: {
                  longitude: params.data.pick_address.longitude,
                  latitude: params.data.pick_address.latitude
                },
                receive_address: {
                  longitude: params.data.receive_address.longitude,
                  latitude: params.data.receive_address.latitude
                },
                user: {
                  token: params.data.user.token
                }
              }
            }
            break;
          }
          case "MCOM":
          default: {
            setting.body = {
              employee_id: params.employeeId,
              note: params.note,
              type: "MCOM",
            }
            break;
          }
        }
        break;
      case ActivityEnum.BILL_MODIFIED_AT_SENT_SHIPPER:
        setting.uri = this.apiUrl(`${billId}/activity/sentShipperBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_SENT_SHIPPER:
        setting.uri = this.apiUrl(`${billId}/activity/sentShipperBillStatus/cancelled`);
        break;
      case ActivityEnum.BILL_DELIVERING:
        setting.uri = this.apiUrl(`${billId}/activity/deliveringBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_DELIVERING:
        setting.uri = this.apiUrl(`${billId}/activity/deliveringBillStatus/modified`);
        break;
      case ActivityEnum.BILL_CANCELLED_AT_DELIVERING:
        setting.uri = this.apiUrl(`${billId}/activity/deliveringBillStatus/cancelled`);
        break;
      case ActivityEnum.BILL_PAID:
        setting.uri = this.apiUrl(`${billId}/activity/paidBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_PAID:
        setting.uri = this.apiUrl(`${billId}/activity/paidBillStatus/modified`);
        break;
      case ActivityEnum.BILL_COLLECTED_MONEY:
        setting.uri = this.apiUrl(`${billId}/activity/collectedMoneyBillStatus`);
        break;
      case ActivityEnum.BILL_MODIFIED_AT_COLLECTED_MONEY:
        setting.uri = this.apiUrl(`${billId}/activity/collectedMoneyBillStatus/modified`);
        break;
      default:
        throw new Error('This activity not allow for this bill');
    }

    let res: any = await this.exec(setting);
    return res;
  }

  async summaryBill(params: {
    startTime: string, endTime: string
  }) {
    let { startTime, endTime } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`summary_daily`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: {
        start_time: startTime,
        end_time: endTime
      }
    }
    console.log(startTime + " --- " + endTime + " --- " + JSON.stringify(setting.body));
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async calculateShipFee(params: {
    longitude: number,
    latitude: number
  }) {
    let { longitude, latitude } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`calculate_ship_fee`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { longitude, latitude }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async orderAtStore(params: any) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`order_at_store`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: params
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async orderOnlineByEmployee(params: any) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`order_online_by_employee`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: params
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async updateSubFee(billId: string, subFeeId: string, params: {
    price: number,
    description: string,
  }) {
    let { price, description } = params;
    let setting = {
      method: 'PUT',
      uri: this.apiUrl(`${billId}/sub_fees/${subFeeId}`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { price, description }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async cancel(params: {
    billId: string
  }) {
    let { billId } = params;
    let setting = {
      method: 'PUT',
      uri: this.apiUrl(`${billId}/cancel`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async getPrudentialEmployeeBill(params: any
    // {
    //   customer_type: string
    // }
  ) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`get_prudential_employee_bill`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: params
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async getPrudentialPaidHistory(params: any) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`get_prudential_paid_history`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: params
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async orderOnlineByCustomer(accessToken: string, params: any) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`order_online_by_customer`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': accessToken
      },
      json: true,
      body: params
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

}
