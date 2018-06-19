import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iLicenseDetail extends iCrud {
  license_id?: string,
  start_time?: Date,
  end_time?: Date,
  price?: number,
  number_of_transaction?: number,
  number_of_used_transaction?: number,
  type?: "transaction" | "month" | "initialize" | "trial",
  transaction_type?: "completed_bill" | "account" | "smart_code" | "promotion" | "message",
  description?: string
}

export class LicenseDetail extends CrudAPI<iLicenseDetail> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'license_detail')
  }
}
