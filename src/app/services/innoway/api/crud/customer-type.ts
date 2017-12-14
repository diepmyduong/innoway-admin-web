import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iCustomerType extends iCrud {
    amount_of_purchase?: number,
    brand_id?: string,
    last_date_order?: Date,
    name?: string,
    number_of_bill?: number,
    sex?: 'male' | 'female' | 'order',
}

export class CustomerType extends CrudAPI<iCustomerType> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'customer_type')
    }
}