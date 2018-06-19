import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBlogType extends iCrud {
  name?: string,
  name_vi?: string,
  short_description?: string,
  thumb?: string
}

export class BlogType extends CrudAPI<iBlogType> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'blog_category')
  }
}
