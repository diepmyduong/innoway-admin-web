import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iMcomManager extends iCrud {

}

export class McomManager extends CrudAPI<iMcomManager> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'mcom_manager')
    }
}
