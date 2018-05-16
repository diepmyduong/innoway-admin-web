import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBlog extends iCrud {
  author_id?: string,
  blog_category_id?: string,
  title?: string,
  title_vi?: string,
  content?: string,
  description?: string,
  short_description?: string,
  url?: string,
  thumb?: string
}

export class Blog extends CrudAPI<iBlog> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'blog')
  }
}
