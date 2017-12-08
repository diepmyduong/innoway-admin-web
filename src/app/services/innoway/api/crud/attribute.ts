import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iAttribute extends iCrud {
    brand_id?: string,
    name?: string,
    value?: string,
}

export class Attribute extends CrudAPI<iAttribute> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'attribute')
    }
}