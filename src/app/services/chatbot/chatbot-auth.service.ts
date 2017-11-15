import { Injectable } from '@angular/core';
import { ChatbotConfigService } from './chatbot-config.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AuthService } from '../auth.service'
import { iApp } from './api/crud/app'
import * as request from 'request-promise'
@Injectable()
export class ChatbotAuthService {

  constructor(
    public chatbotConfig: ChatbotConfigService,
    public innowayAuth: AuthService
  ) { 

  }

  onAuthStateChange = new BehaviorSubject<Boolean>(undefined)
  app: iApp
  adminToken: string

  async exec(option: any) {
    if (!option) throw new Error("option undefined in exec")
    try {
      let { uri, ...anohter } = option
      return await request(uri, anohter)
    } catch (resError) {
      console.error("Innoway Auth ERROR", resError.error.message)
      throw resError;
    }
  }

  async getAppState() {
    this.adminToken = await this.innowayAuth.getAccessToken()
    await this.getApps()
    return this.onAuthStateChange.getValue()
  }
  
  async getApps() {
    if (this.adminToken) {
      const option = {
        method: 'GET',
        uri: this.chatbotConfig.apiUrl('app'),
        headers: { //headers
          'User-Agent': 'Request-Promise',
          'access_token': this.adminToken
        },
        json: true, // Automatically parses the JSON string in the response,
      }
      try {
        let res = await this.exec(option)
        if(res.results && res.results.objects && res.results.objects.count > 0) {
          this.app = res.results.objects.rows[0]
        }
        this.onAuthStateChange.next(true)
        return res.results.objects.rows
      } catch (err) {
        this.onAuthStateChange.next(false)
        return null
      }
    }else {
      this.onAuthStateChange.next(false)
      return null
    }
  }

}
