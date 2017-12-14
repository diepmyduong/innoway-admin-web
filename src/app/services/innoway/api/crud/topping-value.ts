import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iToppingValue extends iCrud {
    brand_id?: string,
    description?: string,
    name?: string,
    price?: number,
    topping_id?: string,
}

export class ToppingValue extends CrudAPI<iToppingValue> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'topping_value')
    }
}