import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iProductCategory extends iCrud {
  brand_id?: string,
  description?: string,
  thirdparty_id?: string,
  image?: string,
  name?: string,
  parent_id?: string,
  short_description?: string,
  meta_data?: JSON,
  parent?: iProductCategory
}

export class ProductCategory extends CrudAPI<iProductCategory> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'product_category')
  }
}
