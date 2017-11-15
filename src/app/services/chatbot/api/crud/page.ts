import { CrudAPI, iCrud } from '../crud'

import { ChatbotApiService } from '../../chatbot-api.service'
import { iApp } from './app'
import { iSetting } from './setting'
import { iStory } from './story'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

export interface iPage extends iCrud {
    accessToken?: string
    app?: string | iApp
    pageId?: string
    settings?: string[] | iSetting[]
    stories?: string[]
    tokenResetExpires?: number
}

export interface iGetIntentsOption {
    local?: boolean
    reload?: boolean
}

export interface iIntent {
    actions: string[],
    contextIn: any[],
    contextOut: any[],
    events: any[],
    fallbackIntent: boolean,
    id: string,
    name: string,
    parameters: any[],
    priority: number
}

export class Page extends CrudAPI<iPage> {
    constructor(
        public api: ChatbotApiService
    ){
        super(api,'page')
    }

    intents = new BehaviorSubject<iIntent[]>([])

    async getIntents(option: iGetIntentsOption = {
        local: false, reload: true 
    }): Promise<iIntent[]> {
        if(option.local) {
            return this.intents.getValue()
        }
        let setting = {
            uri: this.apiUrl(`${this.api.chatbotAuth.app.activePage }/intents`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        let rows = res.results.object || []
        if(option.reload) this.intents.next(rows)
        return rows;
    }

    async addStory(story:iStory) {
        let setting = {
            method: 'POST',
            uri: this.apiUrl(`${this.api.chatbotAuth.app.activePage }/stories`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            json: true,
            body: story
        }
        let res = await this.exec(setting)
        let row = res.results.object as iStory;
        let items = this.api.story.items.getValue()
        items.push(row)
        this.api.story.items.next(items)
        return row
    }
}