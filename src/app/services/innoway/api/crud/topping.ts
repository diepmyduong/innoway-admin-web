import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iTopping extends iCrud {
    brand_id?: string,
    description?: string,
    is_select_multiple?: boolean,
    name?: string,
}

export class Topping extends CrudAPI<iTopping> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'topping')
    }
}