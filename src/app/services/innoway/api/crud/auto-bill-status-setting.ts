import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iAutoBillStatusSetting extends iCrud {

}

export class AutoBillStatusSetting extends CrudAPI<iAutoBillStatusSetting> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'auto_bill_status_setting')
    }
}
