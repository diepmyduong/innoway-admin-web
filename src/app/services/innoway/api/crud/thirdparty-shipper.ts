import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyShipper extends iCrud {

}

export class ThirdpartyShipper extends CrudAPI<iThirdpartyShipper> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'thirdparty_shipper')
    }
}
