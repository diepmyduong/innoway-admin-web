import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iDevice extends iCrud {

}

export class Device extends CrudAPI<iDevice> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'device')
    }
}
