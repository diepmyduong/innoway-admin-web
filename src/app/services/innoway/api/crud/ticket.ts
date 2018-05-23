import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iTicket extends iCrud {
  employee_id?: string,
  parent_id?: string,
  assignee_id?: string,
  title?: string,
  content?: string,
  action_status?: "normal" | "high" | "urgent",
  activity_status?: "to_do" | "in_progress" | "reopen" | "resolved" | "closed",
  ticket_type_id?: string,
  attached_fiels?: string
}

export class Ticket extends CrudAPI<iTicket> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'ticket')
  }
}
