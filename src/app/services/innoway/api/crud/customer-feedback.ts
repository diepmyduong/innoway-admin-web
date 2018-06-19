import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iCustomerFeedback extends iCrud {

}

export class CustomerFeedback extends CrudAPI<iCustomerFeedback> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'customer_feedback')
    }
}
