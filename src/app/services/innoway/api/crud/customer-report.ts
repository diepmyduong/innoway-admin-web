import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iCustomerReport extends iCrud {

}

export class CustomerReport extends CrudAPI<iCustomerReport> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'customer-report')
  }
}
