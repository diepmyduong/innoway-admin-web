import { Injectable } from '@angular/core';
import { ChatbotAuthService } from './chatbot-auth.service'
import { ChatbotConfigService } from './chatbot-config.service'
import { App, iApp } from './api/crud/app'
import { Page, iPage } from './api/crud/page'
import { Setting, iSetting } from './api/crud/setting'
import { Story, iStory } from './api/crud/story'
import { Card, iCard } from './api/crud/card'

@Injectable()
export class ChatbotApiService {

  constructor(
    public chatbotConfig: ChatbotConfigService,
    public chatbotAuth: ChatbotAuthService
  ) { 

  }
  
  app = new App(this)
  page = new Page(this)
  setting = new Setting(this)
  story = new Story(this)
  card = new Card(this)

}
