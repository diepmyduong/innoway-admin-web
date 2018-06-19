import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iShipment extends iCrud {

}

export class Shipment extends CrudAPI<iShipment> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'shipment')
  }

  async registerGHN(params: {
    email: string,
    password: string,
    contact_phone: string,
    contact_name: string
  }) {
    let { email, password, contact_phone, contact_name } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`ghn/register`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { email, password, contact_phone, contact_name }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async loginGHN(params: {
    email: string,
    password: string
  }) {
    let { email, password } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`ghn/login`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { email, password }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async registerGHTK(params: {
    name: string,
    first_address: string,
    province: string,
    district: string,
    tel: string,
    email: string
  }) {
    let { name, first_address, province, district, tel, email } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`ghtk/register`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { name, first_address, province, district, tel, email }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async loginGHTK(params: {
    email: string,
    password: string
  }) {
    let { email, password } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`ghtk/login`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { email, password }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async getAuthorizationCodeUBER() {
    let setting = {
      method: 'GET',
      uri: `https://crm.m-commerce.com.vn/?code=AUTHORIZATION_CODE`,
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
    }
    let res: any = await this.exec(setting);
    return res;
  }
}
