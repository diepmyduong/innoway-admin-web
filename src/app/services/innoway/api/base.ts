import { InnowayApiService } from '../innoway-api.service'
import * as request from 'request-promise'
import * as Console from 'console-prefix'

export class BaseAPI {
    constructor(
        public api: InnowayApiService,
        public moduleName: string 
    ){
    }

    get log() {
        return Console(`[API ${this.moduleName}]`).log
    }

    apiUrl(path:string = ""){
        return this.api.innowayConfig.apiUrl(`${this.moduleName}/${path}`)
    }

    //Call API
    protected async exec(option){
        if(!option) throw new Error("option undefined in exec")
        try {
            return await request(option)
        }catch(resError){
            this.log("API ERROR",resError.error.message)
            throw resError;
        }
    }
}