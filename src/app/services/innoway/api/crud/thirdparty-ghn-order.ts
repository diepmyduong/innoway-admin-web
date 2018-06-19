import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyGHNOrder extends iCrud {

}

export class ThirdpartyGHNOrder extends CrudAPI<iThirdpartyGHNOrder> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'thirdparty_ghn_order')
    }
}
