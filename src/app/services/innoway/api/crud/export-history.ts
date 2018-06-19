import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iExportHistory extends iCrud {
  employee_id?: string,
  product_id?: string,
  topping_value_id?: string,
  store_id?: string,
  supplier_id?: string,
  amount?: number,
  note?: string
}

export class ExportHistory extends CrudAPI<iExportHistory> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'export_history')
  }
}
