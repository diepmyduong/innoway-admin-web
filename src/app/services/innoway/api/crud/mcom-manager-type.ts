import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iMcomManagerType extends iCrud {

}

export class McomManagerType extends CrudAPI<iMcomManagerType> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'mcom_manager_type')
    }
}
