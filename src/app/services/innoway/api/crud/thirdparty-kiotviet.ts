import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyKiotViet extends iCrud {

}

export class ThirdpartyKiotViet extends CrudAPI<iThirdpartyKiotViet> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'thirdparty_kiotviet')
  }

  async connect(params: {
    client_id: string,
    client_secret: string,
    retailer: string
  }) {
    let { client_id, client_secret, retailer } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`integrate`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { client_id, client_secret, retailer }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async syncCategoryFromKiotViet(params:{
    type: string //overwrite
  }) {
    let { type } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`sync_category_from_kiotviet`),
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

  async syncProductFromKiotViet(params:{
    type: string //overwrite
  }) {
    let { type } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`sync_product_from_kiotviet`),
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

  async syncBranchFromKiotViet(params:{
    type: string //overwrite
  }) {
    let { type } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`sync_branch_from_kiotviet`),
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

  async disconnect(){

  }
}
