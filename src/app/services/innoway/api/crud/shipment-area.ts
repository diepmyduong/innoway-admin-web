import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iShipmentArea extends iCrud {

}

export class ShipmentArea extends CrudAPI<iShipmentArea> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'shipment_area')
    }
}
