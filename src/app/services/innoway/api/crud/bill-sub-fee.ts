import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBillSubFee extends iCrud {
  bill_id?: string,
  description?: string,
  price?: string,
}

export class BillSubFee extends CrudAPI<iBillSubFee> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'bill_sub_fee')
    }
}
