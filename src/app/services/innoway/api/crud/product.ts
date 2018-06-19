import { CrudAPI, iCrud, crudOptions } from '../crud'
import { InnowayApiService } from '../../innoway-api.service'
import * as _ from 'lodash'
import { iTopping } from 'app/services/innoway';
import { iProductTopping } from 'app/services/innoway/api/crud/product-topping';

export interface iProduct extends iCrud {
  base_price?: number,
  brand_id?: string,
  category_id?: string,
  description?: string,
  list_image?: string[],
  name?: string,
  price?: number,
  product_type_id?: string,
  thumb?: string,
  unit_id?: string,
  short_description?: string,
  thirdparty_id?: string,
  link?: string,
  code?: number,
  is_available?: boolean,
  rate?: number,
  is_gift?:boolean,
  meta_data?:JSON,

  toppings?: iProductTopping[]

  // sku?: string,
  // product_duration: number,
  // tag?: JSON,
  // point_id?: string,
  // point_value?: number,
  // units_in_stock?: number,
  // is_gift?: boolean,
  // exp_date?: Date,
  // mfg_date?: Date,
  // pao_time?: number,
  // meta_data?: JSON
}

export class Product extends CrudAPI<iProduct> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'product')
  }

  async addToppings(id: string, toppingIds: string[], options?: crudOptions) {
    options = _.assign({}, this.options, options)
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`${id}/toppings`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { topping_ids: toppingIds }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object.rows
    return rows;
  }

  async updateToppings(id: string, toppingIds: string[], options?: crudOptions) {
    options = _.assign({}, this.options, options)
    let setting = {
      method: 'PUT',
      uri: this.apiUrl(`${id}/toppings`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { topping_ids: toppingIds }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object.rows
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
}
