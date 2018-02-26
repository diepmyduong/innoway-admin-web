import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iRoom extends iCrud {

}

export class Room extends CrudAPI<iRoom> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'room')
    }
}
