import { Injectable } from '@angular/core'
import { InnowayAuthService } from './innoway-auth.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { environment } from '@environments'
import * as Console from 'console-prefix'
import * as firebase from 'firebase'
@Injectable()
export class FcmService {

  constructor(
    public innowayAuth: InnowayAuthService
  ) {
    this.firebaseApp = this.innowayAuth.firebaseApp
    this.setupFCMSeviceWorker()
  }
  firebaseApp: firebase.app.App
  fcmRegistration: ServiceWorkerRegistration
  fcmHasNotifyPermission: boolean
  onMessage = new BehaviorSubject<any>(undefined)
  onMessageTokenChange = new BehaviorSubject<string>(undefined)

  get log() { return Console(`[FCM Service]`).log }

  get messaging() { return this.firebaseApp.messaging() }

  private async setupFCMSeviceWorker() {
    this.log('Setup FCM Service Worker')
    if ('serviceWorker' in navigator) {
      this.fcmRegistration = await navigator.serviceWorker.register(environment.innoway.fcmServiceWorkerPath)
      this.log('FCM Service Worker registered');
      this.messaging.useServiceWorker(this.fcmRegistration)
      try {
        this.log('Request Notify Permission')
        await this.messaging.requestPermission()
        this.fcmHasNotifyPermission = true
        this.handleRefeshToken()
        this.messaging.onMessage(this.handleMessages.bind(this))
        navigator.serviceWorker.addEventListener('message', event => {
          if ('from' in event.data) {
            this.handleMessages(event.data)
          }
        });
      } catch (err) {
        this.log('Notify Permission Deny')
        this.fcmHasNotifyPermission = false
      }
    }
  }

  private handleRefeshToken() {
    this.messaging.onTokenRefresh(function () {
      this.getToken()
    });
  }

  private handleMessages(payload) {
    try {
      payload.data.json = JSON.parse(payload.data.json)
    } catch (err) {
      payload.data.json = null
    }
    this.onMessage.next(payload.data)
  }

  async getMessageToken() {
    const token = await this.messaging.getToken()
    if (!token) {
      await this.messaging.requestPermission()
      this.fcmHasNotifyPermission = true
      return await this.getMessageToken()
    }
    this.onMessageTokenChange.next(token)
    return token
  }

}
