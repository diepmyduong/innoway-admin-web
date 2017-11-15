import { Injectable } from '@angular/core';

@Injectable()
export class ChatbotConfigService {

  constructor() {
    this.config = {
      host: "http://localhost:5000", //"https://chatbot-dot-m-commerce-cloud-service.appspot.com", // 
      version: "v1"
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
