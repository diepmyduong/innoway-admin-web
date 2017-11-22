import { Injectable } from '@angular/core';
import { environment } from '@environments'
@Injectable()
export class ChatbotConfigService {

  constructor() {
    this.config = {
      host: environment.chatbot.host,
      version: environment.chatbot.version
    }
  }

  config: {
    host: string
    version: string
  }

  apiUrl(path: string = "") {
    return `${this.config.host}/api/${this.config.version}/${path}`
  }

}
