import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyHaravan extends iCrud {
  api_key: string,
  password: string,
  shared_secret: string,
}

export class ThirdpartyHaravan extends CrudAPI<iThirdpartyHaravan> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'thirdparty_haravan')
  }

  async connect(params: {
    api_key: string,
    password: string,
    shared_secret: string,
    address: string
  }) {
    let { api_key, password, shared_secret, address } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`connect`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { api_key, password, shared_secret, address }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async disconnect() {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`disconnect`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async syncAllProduct(params: {
    type: string //overwrite
  }) {
    let { type } = params
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`sync_all_product`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { type }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

}
