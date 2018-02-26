import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyGHNService extends iCrud {

}

export class ThirdpartyGHNService extends CrudAPI<iThirdpartyGHNService> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'thirdparty_ghn_service')
    }
}
