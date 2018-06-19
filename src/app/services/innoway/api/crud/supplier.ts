import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iSupplier extends iCrud {
  supplier_category_id?: string,
  name?: string,
  description?: string,
  longitude?: number,
  latitude?: number,
  address?: string,
  type?: string
}

export class Supplier extends CrudAPI<iSupplier> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'supplier')
  }
}
