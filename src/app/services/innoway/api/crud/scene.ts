import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iScene extends iCrud {
  room_id?: string,
  name?: string,
  named?: string,
  type?: string,
  actions?: string,
  ip?: string,
  brand_device?: string
}

export class Scene extends CrudAPI<iScene> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'scene')
  }
}
