import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iScene extends iCrud {

}

export class Scene extends CrudAPI<iScene> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'scene')
    }
}
