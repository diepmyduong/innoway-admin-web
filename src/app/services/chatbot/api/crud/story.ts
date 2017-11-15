import { CrudAPI, iCrud, crudOptions } from '../crud'

import { ChatbotApiService } from '../../chatbot-api.service'
import { iPage } from './page'
import { iCard } from './card'
import * as _ from 'lodash'

export interface iStory extends iCrud {
    cards?: string[] | iCard[]
    intent?: string
    name?: string
    page?: string | iPage
    type?: "custom" | "intent"
}

export class Story extends CrudAPI<iStory> {
    constructor(
        public api: ChatbotApiService
    ) {
        super(api, 'story')
    }

    async addCard(storyId:string, card: iCard, options: crudOptions = {
        reload: true
    }) {
        if (!card) throw new Error('card undefined in add')
        options = _.assign({}, this.options, options)
        let setting = {
            method: 'POST',
            uri: this.apiUrl(`${storyId}/cards`),
            qs: this._paserQuery(options.query),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            body: card,
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        let row = res.results.object as iCard;
        let cards = this.api.card.items.getValue()
        cards.push(row)
        this.api.card.items.next(cards)
        if (options.reload) {
            let items = this.items.getValue()
            const storyIndex = _.findIndex(items, { _id: storyId })
            items[storyIndex] = await this.getItem(storyId, { local: false, reload: true })
            this.items.next(items)
        }
        return row
    }
}