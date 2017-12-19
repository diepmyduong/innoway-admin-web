import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBillRelatedPeople extends iCrud {
  receiver_name?: string,
  receiver_phone?: string,
  receiver_address?: string,
  receiver_note?: string,

  payer_name?: string,
  payer_phone?: string,
  payer_address?: string,
  payer_note?: string
}

export class BillRelatedPeople extends CrudAPI<iBillRelatedPeople> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'bill_related_people')
  }
}
