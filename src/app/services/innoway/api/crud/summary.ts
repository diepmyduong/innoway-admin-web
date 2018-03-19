import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iSummary extends iCrud {

}

export class Summary extends CrudAPI<iSummary> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'summary')
  }

  // {
  // "start_time": "2017-10-12",
  // "end_time": "2018-12-24",
  // "product_type_id": "b134ee80-e6fd-11e7-8421-6f061557e745",
  // "category_id": "64fcfa90-c910-11e7-bef9-95083867c1ab",
  // "is_show_branch": true
  // }

  async summaryProduct(params: {
    start_time: string,
    end_time: string,
    product_type_id: string,
    category_id: string,
    is_show_branch: boolean
  }) {
    let { start_time, end_time, product_type_id, category_id, is_show_branch } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`product`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { start_time, end_time, product_type_id, category_id, is_show_branch }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async summaryEmployee(id: string, params: {
    start_time: string,
    end_time: string,
    is_show_activity: boolean,
    is_show_feedback: boolean,
  }) {
    let { start_time, end_time, is_show_activity, is_show_feedback } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`employee/${id}`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { start_time, end_time, is_show_activity, is_show_feedback }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async summaryDaily(params: {
    start_time: string,
    end_time: string
  }) {
    let { start_time, end_time } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`daily`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { start_time, end_time }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

  async summaryCustomer(id: string, params: {
    start_time: string,
    end_time: string,
    is_show_promotion: boolean,
    is_show_feedback: boolean,
  }) {
    let { start_time, end_time, is_show_promotion, is_show_feedback } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`customer/${id}`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { start_time, end_time, is_show_promotion, is_show_feedback }
    }
    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }

}
