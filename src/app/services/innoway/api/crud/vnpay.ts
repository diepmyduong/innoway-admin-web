import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iVNPay extends iCrud {

}

export class VNPay extends CrudAPI<iVNPay> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'vnpay')
  }

  async createPaymentBillUrl(params: {
    amount: number,
    bank_code: string,
    bill_id: string
  }) {
    let { amount, bank_code, bill_id } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`create_payment_bill_url`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { amount, bank_code, bill_id }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async createBuyButton(params: {
    subscriber_id: string,
    country: string,
    currency: string,
    products: any[],
    sub_fee: number,
    sub_fee_note: string,
    shipping: boolean,
    latitude: number,
    longitude: number,
    address: string
  }) {
    let { subscriber_id, country, currency, products,
      sub_fee, sub_fee_note, shipping, latitude, longitude, address } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`create_payment_order_url`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: {
        subscriber_id, country, currency, products,
        sub_fee, sub_fee_note, shipping, latitude, longitude, address
      }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }
}
