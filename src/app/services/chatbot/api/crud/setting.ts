import { CrudAPI, iCrud } from '../crud'

import { ChatbotApiService } from '../../chatbot-api.service'
import { iPage } from './page'

export interface iSetting extends iCrud {
    isDefault: boolean
    option: any
    type: "persistent_menu" | "greeting" | "get_started" | "whitelisted_domains"
}

export class Setting extends CrudAPI<iSetting> {
    constructor(
        public api: ChatbotApiService
    ){
        super(api,'setting')
    }
}