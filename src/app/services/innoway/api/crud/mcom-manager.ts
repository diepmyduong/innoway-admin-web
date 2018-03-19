import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iMcomManager extends iCrud {
  email?:string,
  mcom_manager_type?: string,
  name?:string,
  phone?:string,
  description?: string
}

export class McomManager extends CrudAPI<iMcomManager> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'mcom_manager')
    }
}
