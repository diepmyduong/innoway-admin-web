import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'
import { iProduct, iTopping } from 'app/services/innoway';

export interface iProductTopping extends iCrud {
    rand_id?: string,
    product_id?: string,
    topping_id?: string,

    product?: iProduct
    topping?: iTopping
    
}

export class ProductCategory extends CrudAPI<iProductTopping> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'product_topping')
    }
}