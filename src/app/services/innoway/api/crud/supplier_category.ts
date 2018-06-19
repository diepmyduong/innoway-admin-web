import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iSupplierCategory extends iCrud {
  name?:string,
  description?:string,
}

export class SupplierCategory extends CrudAPI<iSupplierCategory> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'supplier_category')
  }
}
