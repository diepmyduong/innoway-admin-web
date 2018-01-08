import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iPromotionCustomerDetail extends iCrud {
    promotion_customer_id?: string,
    bill_id?: string,
    amount_promotion?: number,    
}

export class PromotionCustomerDetail extends CrudAPI<iPromotionCustomerDetail> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'promotion_customer_detail')
    }
}
