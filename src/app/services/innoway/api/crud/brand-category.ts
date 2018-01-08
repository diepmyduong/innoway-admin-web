import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBrandCategory extends iCrud {
  name?: string
  description?: string
}

export class BrandCategory extends CrudAPI<iBrandCategory> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'brand_category')
  }
}
