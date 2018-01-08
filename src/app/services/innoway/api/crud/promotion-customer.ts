import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iPromotionCustomer extends iCrud {
    promotion_id?: string,
    customer_id?: string,
    number_of_used_time?: number,
}

export class PromotionCustomer extends CrudAPI<iPromotionCustomer> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'promotion_customer')
    }
}
