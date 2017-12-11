import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iProductCategory extends iCrud {
    brand_id?: string,
    name?: string,
    value?: string,
}

export class ProductCategory extends CrudAPI<iProductCategory> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'product_category')
    }
}