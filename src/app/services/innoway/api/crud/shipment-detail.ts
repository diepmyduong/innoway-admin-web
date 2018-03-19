import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iShipmentDetail extends iCrud {

}

export class ShipmentDetail extends CrudAPI<iShipmentDetail> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'shipment_detail')
  }
}
