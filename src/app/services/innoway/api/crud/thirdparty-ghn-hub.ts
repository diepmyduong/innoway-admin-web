import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyGHNHub extends iCrud {

}

export class ThirdpartyGHNHub extends CrudAPI<iThirdpartyGHNHub> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'thirdparty_ghn_hub')
    }
}
