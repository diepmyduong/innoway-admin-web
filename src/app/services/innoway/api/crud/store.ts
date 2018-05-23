import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iStore extends iCrud {
  employee_id?: string,
  address?: string,
  longitude?: number,
  latitude?: number,
  description?: string,
  square?: number,
  value?: number,
}

export class Store extends CrudAPI<iStore> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'store')
  }
}
