import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iTicketResult extends iCrud {
  name?: string,
  description?: string,
  ticket_id?: string,
  result_type?: string,
  product_ids?: string,
  bill_id?: string,
  note?: string,
  employee_id?: string
}

export class TicketResult extends CrudAPI<iTicketResult> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'ticket_result')
  }
}
