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
}