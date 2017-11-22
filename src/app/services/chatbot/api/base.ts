import { ChatbotApiService } from '../chatbot-api.service'
import * as request from 'request-promise'

export class BaseAPI {
    constructor(
        public api: ChatbotApiService,
        public moduleName: string 
    ){
    }

    apiUrl(path:string = ""){
        return this.api.chatbotConfig.apiUrl(`${this.moduleName}/${path}`)
    }

    //Call API
    protected async exec(option){
        if(!option) throw new Error("option undefined in exec")
        try {
            return await request(option)
        }catch(resError){
            console.error("API ERROR",resError.error.message)
            throw resError;
        }
    }
}