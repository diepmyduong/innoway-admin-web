import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyKiotViet extends iCrud {

}

export class ThirdpartyKiotViet extends CrudAPI<iThirdpartyKiotViet> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'thirdparty_kiotviet')
    }
}
