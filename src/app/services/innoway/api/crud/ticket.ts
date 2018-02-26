import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iTicket extends iCrud {

}

export class Ticket extends CrudAPI<iTicket> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'ticket')
    }
}
