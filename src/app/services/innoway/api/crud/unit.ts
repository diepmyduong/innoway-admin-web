import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iUnit extends iCrud {
    brand_id: string,
    name: string,
    offset: number,
}

export class Unit extends CrudAPI<iUnit> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'unit')
    }
}