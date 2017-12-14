import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBrandShip extends iCrud {
    brand_id?: string,
    allow_pick_at_store?: boolean,
    allow_ship?: boolean,
    ship_method?: 'distance' | 'area',
    ship_fee_per_km?: number,
}

export class BrandShip extends CrudAPI<iBrandShip> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'brand_ship')
    }
}