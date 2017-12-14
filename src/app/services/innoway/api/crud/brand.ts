import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBrand extends iCrud {
    thirdparty_kiotviet_id?: string,
    color?: string,
    logo?: string,
    name?: string,
    trial_expire?: string,
    type?: number,
    brand_ship_id?: string,
    vat_value?: number,
    address?: string,
    phone?: string,
    code?: string,
}

export class Brand extends CrudAPI<iBrand> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'brand')
    }
}