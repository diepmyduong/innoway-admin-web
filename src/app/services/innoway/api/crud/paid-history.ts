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
}