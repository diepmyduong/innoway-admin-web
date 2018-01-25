import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iPromotion extends iCrud {
  amount?: number,
  brand_id?: string,
  code?: string,
  description?: string,
  end_date?: Date,
  limit?: number,
  name?: string,
  promotion_type_id?: string,
  is_must_use_scanning_code?: boolean,
  promotion_type?: 'discount_by_percent' | 'discount_by_price' | 'discount_by_gift',
  start_date?: Date,
  value?: number,
  image?: string,
  short_description?: string,
}

export class Promotion extends CrudAPI<iPromotion> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'promotion')
  }

  async addCustomerTypes(id: string, customer_type_ids: string[]) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`${id}/customer_types`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { customer_type_ids }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object.rows
    return rows;
  }

  async updateCustomerType(id: string, customer_type_ids: string[]) {
    let setting = {
      method: 'PUT',
      uri: this.apiUrl(`${id}/customer_types`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { customer_type_ids }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object.rows
    return rows;
  }

  async sendPromotionToMessenger(id: string, message: string) {
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`${id}/send`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { message }
    }
    let res: any = await this.exec(setting);
    return res;
  }

  async getDetailPromotion(id: string, params: {
    is_show_used_customer: boolean,
    is_show_used_bill: boolean,
  }) {
    let { is_show_used_customer, is_show_used_bill } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`${id}/get_detail_promotion`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { is_show_used_customer, is_show_used_bill }
    }
    let res: any = await this.exec(setting);
    return res;
  }

  // this.router.post('/:id/send', this.sendMiddlewares(), this.route(this.send))
  // this.router.post('/:promotion_id/get_detail_promotion', this.getDetailPromotionMiddlewares(), this.route(this.getDetailPromotion));
}
