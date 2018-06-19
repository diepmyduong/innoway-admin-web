import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iContract extends iCrud {
  brand_id?: string,
  buyer?: string,
  agent?: string,
  description?: string,
  duration?: number,
  is_active?: boolean,
  start_time?: Date,
  end_time?: Date
}

export class Contract extends CrudAPI<iContract> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'contract')
  }

  async upgrade(params: {
    type: any,
    properties: {
      contract_id: string,
      brand_id: string,
      type: 'transaction' | 'month',
      transaction_type: 'completed_bill' | 'account' | 'smart_code' | 'promotion' | 'message',
      start_time: string,
      end_time: string,
      price: number,
    }
  }) {
    let { type, properties } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`upgrade`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { type, properties }
    }
    let res: any = await this.exec(setting);
    return res;
  }

  async getPriceLicense(params: {
    type: any,
    properties: {
      start_time: string,
      end_time: string,
      brand_id: string
    },
  }) {
    let { type, properties } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`get_price_license`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { type, properties }
    }
    let res: any = await this.exec(setting);
    return res;
  }
}
