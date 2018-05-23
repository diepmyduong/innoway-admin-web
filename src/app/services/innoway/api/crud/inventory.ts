import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iInventory extends iCrud {

}

export class Inventory extends CrudAPI<iInventory> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'inventory')
  }

  async export(params: {
    employee_id?: string,
    product_id?: string,
    topping_value_id?: string,
    store_id?: string,
    supplier_id?: string,
    amount?: number,
    note?: string,
    status?: number
  }) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`export`),
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

  async import(params: {
    employee_id?: string,
    product_id?: string,
    topping_value_id?: string,
    store_id?: string,
    supplier_id?: string,
    amount?: number,
    note?: string,
    status?: number
  }) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`import`),
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
