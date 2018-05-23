import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iTicketType extends iCrud {
  name?: string,
  description?: string
}

export class TicketType extends CrudAPI<iTicketType> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'ticket_type')
  }
}
