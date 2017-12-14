import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iShipArea extends iCrud {
    brand_id?: string,
    name?: string,
    fee?: number,
    city?: string,
    area?: string,
}

export class ShipArea extends CrudAPI<iShipArea> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'ship_area')
    }
}