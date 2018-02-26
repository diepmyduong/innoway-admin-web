import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iTicketComment extends iCrud {

}

export class TicketComment extends CrudAPI<iTicketComment> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'ticket-comment')
    }
}
