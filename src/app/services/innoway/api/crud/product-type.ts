import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iProductType extends iCrud {
    brand_id?: string,
    name?: string,
    value?: string,
}

export class ProductType extends CrudAPI<iProductType> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'product_type')
    }
}