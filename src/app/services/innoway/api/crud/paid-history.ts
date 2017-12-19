import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iPaidHistory extends iCrud {
    brand_id?: string,
    bill_id?: string,
    pay_amount?: number,
    return_amount?: number,
    remain_amount?: number,
    transaction_status?: 'Partial' | 'Full',
    receive_amount?: number,
}

export class PaidHistory extends CrudAPI<iPaidHistory> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'paid_history')
    }

    async updatePaidHistory(params: {
      bill_id: string,
      receive_amount: number,
      pay_amount: number
    }) {
      let { bill_id, receive_amount, pay_amount } = params;
      let setting = {
        method: 'POST',
        uri: this.apiUrl(`update_paid_history`),
        headers: { //headers
          'User-Agent': 'Request-Promise',
          'access_token': this.api.innowayAuth.adminToken
        },
        json: true,
        body: { bill_id, receive_amount, pay_amount }
      }
      var res: any = await this.exec(setting);
      var row = res.results.object;
      return row;
    }
}
