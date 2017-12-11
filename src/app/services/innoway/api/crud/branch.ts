import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBranch extends iCrud {
    address?: string,
    thirdparty_id?: string,
    brand_id?: string,
    employee_id?: string,
    code?: number,
    name?: string,
    phone?: string,
    type?: number,
    longitude?: number,
    latitude?: number,
}

export class Branch extends CrudAPI<iBranch> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'branch')
    }
}