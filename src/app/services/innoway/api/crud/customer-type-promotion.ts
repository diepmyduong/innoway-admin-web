import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iCustomerTypePromotion extends iCrud {
    amount_of_purchase: number,
    brand_id: string,
    last_date_order: Date,
    name: string,
    number_of_bill: number,
    sex: 'male' | 'female' | 'other',
}

export class CustomerTypePromotion extends CrudAPI<iCustomerTypePromotion> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'customer_type_promotion')
    }
}