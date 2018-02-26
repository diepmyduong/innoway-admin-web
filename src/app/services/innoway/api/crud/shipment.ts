import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iShipment extends iCrud {

}

export class Shipment extends CrudAPI<iShipment> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'shipment')
    }
}
