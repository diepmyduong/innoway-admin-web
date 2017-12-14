import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iPromotionType extends iCrud {
    brand_id?: string,
    description?: string,
    name?: string,
}

export class PromotionType extends CrudAPI<iPromotionType> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'promotion_type')
    }
}