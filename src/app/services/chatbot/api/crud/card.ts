import { CrudAPI, iCrud } from '../crud'

import { ChatbotApiService } from '../../chatbot-api.service'
import { iPage } from './page'

export interface iCard extends iCrud {
    option?: any
    page?: string | iPage
    type?: "action" | "text" | "image" | "audio" | "video" | "file" | "generic" | "button" | "list" | "receipt" | "generic_categories" | "generic_products" | "generic_promotions" | "generic_promotion" | "innoway_receip"
}

export class Card extends CrudAPI<iCard> {
    constructor(
        public api: ChatbotApiService
    ) {
        super(api, 'card')
    }

    async build(cardId: string) {
        let setting = {
            method: 'GET',
            uri: this.apiUrl(`${cardId}/build`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        return res.results.object
    }
}