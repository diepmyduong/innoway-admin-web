import { CrudAPI, iCrud } from '../crud'

import { ChatbotApiService } from '../../chatbot-api.service'
import { iPage } from './page'

export interface iApp extends iCrud {
    activePage?: string | iPage
    appSecret?: string
    accessToken?: string
    brandId?: string
    expireDate?: Date
}

export class App extends CrudAPI<iApp> {
    constructor(
        public api: ChatbotApiService
    ){
        super(api,'app')
    }
}