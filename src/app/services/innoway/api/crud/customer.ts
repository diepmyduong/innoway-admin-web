import { CrudAPI, iCrud, crudOptions } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iCustomer extends iCrud {
  account_type?: string,
  active_code?: string,
  avatar?: string,
  birthday?: Date,
  brand_id?: string,
  email?: string,
  fullname?: string,
  phone?: string,
  sex?: 'male' | 'female' | 'other',
  trust_point?: number,
  number_of_bill?: number,
  amount_of_purchase?: number,
  code?: string,
  last_date_order?: Date,
}

export class Customer extends CrudAPI<iCustomer> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'customer')
  }

  async getCustomerByPhone(params: { phone: string }) {
    const { phone } = params
    const setting = {
      method: 'POST',
      uri: this.apiUrl(`get_customer_by_phone`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { phone }
    }
    const res: any = await this.exec(setting);
    const row = res.results.object
    return row;
  }

  async getPromotions(id: string, options: crudOptions = {}) {
    const setting = {
      method: 'GET',
      qs: this._paserQuery(options.query),
      uri: this.apiUrl(`${id}/promotion`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
    }
    let res: any = await this.exec(setting);
    let rows = res.results.objects.rows
    return rows;
  }

  async export() {
    let setting = {
      method: 'GET',
      uri: this.apiUrl(`export`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
    }
    let res: any = await this.exec(setting);
    return res;
  }

  async import(file, params: {
    mode: string
  }) {
    let { mode } = params;

    var data = new FormData();
    data.append("file", file);
    data.append("mode", mode);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', this.apiUrl(`import`), false);
    xhr.setRequestHeader('access_token', this.api.innowayAuth.adminToken);
    // xhr.send(params);
    xhr.send(data);
    let responseObject = JSON.parse(xhr.response)
    return responseObject.data
  }

  async login(userToken: string) {
    let setting = {
      method: 'GET',
      uri: this.apiUrl(`login_with_token`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': userToken
      },
      json: true,
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async getPaymentMethodOfCustomer(userToken: string) {
    let setting = {
      method: 'GET',
      uri: this.apiUrl(`get_payment_method_of_customer`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': userToken
      },
      json: true,
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async orderOnlineByCustomer(userToken: string, params: any) {
    let setting = {
      method: 'GET',
      uri: this.apiUrl(`order_online_by_customer`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': userToken
      },
      json: true,
      body: params
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async createAccount(params: {
    username: string,
    password: string,
    type: string
  }) {
    let { username, password, type } = params
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`create_account`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { username, password, type }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async integrateCustomer(params: any) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`integrate_customer`),
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

}
