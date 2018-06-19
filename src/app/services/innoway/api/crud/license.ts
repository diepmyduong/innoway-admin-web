import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iLicense extends iCrud {
  contract_id?: string,
  parent_id?:string,
  description?: string,
}

export class License extends CrudAPI<iLicense> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'license')
    }
}
