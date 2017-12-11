import { Injectable } from '@angular/core';
import { InnowayConfigService } from './innoway-config.service'
import { InnowayService } from '../innoway.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as request from 'request-promise'
import * as firebase from 'firebase'
import { environment } from '@environments'
import * as Console from 'console-prefix'
import * as _ from 'lodash'
declare var innoway2: any
@Injectable()
export class InnowayAuthService {

  constructor(
    public innowayConfig: InnowayConfigService,
    public innoway1: InnowayService
  ) {
    // firebase.auth().useDeviceLanguage()
    this.firebaseApp = firebase.initializeApp(environment.innoway.firebase)
    // Setup facebook provider
    this.facebookProvider = new firebase.auth.FacebookAuthProvider()
    this.facebookProvider.addScope('business_management,email,manage_pages,pages_messaging,public_profile,publish_pages,user_friends,pages_messaging_phone_number,pages_messaging_subscriptions,read_page_mailboxes')
    this.facebookProvider.setCustomParameters({ 'display': 'popup' });
    // Setup google provider
    this.googleProvider = new firebase.auth.GoogleAuthProvider()
    // Hanlder User Auth State
    this.firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        if (!this.manuallyLogin) {
          this.firebaseUser = user
          this.log('firebase User', user)
          user.getIdToken().then(token => {
            this.firebaseToken = token
            if (!this.innowayUser) {
              return this.loginInnoway()
            }
          }).catch(err => {
            this.onAuthStateChange.next(false)
          })
        }
      } else {
        this.onAuthStateChange.next(false)
      }
    })

  }

  get log() { return Console('[innowayAuth]').log }

  onAuthStateChange = new BehaviorSubject<Boolean>(undefined)
  adminToken: string
  firebaseApp: firebase.app.App
  facebookProvider: firebase.auth.FacebookAuthProvider
  googleProvider: firebase.auth.GoogleAuthProvider
  firebaseUser: firebase.User
  firebaseToken: string
  facebookToken: string
  googleToken: string
  innowayUser: iInnowayUser
  manuallyLogin: boolean = false

  async exec(option: any) {
    if (!option) throw new Error("option undefined in exec")
    try {
      let { uri, ...anohter } = option
      return await request(uri, anohter)
    } catch (resError) {
      if (resError.error.type === "Email not verified" || resError.error.type === "Wrong brand") {
        this.logout()
      }
      this.log("Innoway Auth ERROR", resError.error.message)
      throw resError;
    }
  }

  getFirebaseToken() {
    return this.firebaseApp.auth().currentUser.getIdToken()
  }

  async loginFacebook(brandName: string) {
    this.manuallyLogin = true
    this.innowayConfig.brandName = brandName
    const result = await this.firebaseApp.auth().signInWithPopup(this.facebookProvider)
    this.facebookToken = result.credential.accessToken
    this.firebaseUser = result.user
    this.firebaseToken = await this.firebaseUser.getIdToken()
    return await this.loginInnoway()
  }

  async loginEmailAndPassword(email: string, password: string, brandName: string) {
    this.manuallyLogin = true
    this.innowayConfig.brandName = brandName
    const result = await this.firebaseApp.auth().signInWithEmailAndPassword(email, password)
    this.firebaseUser = result
    this.firebaseToken = await this.firebaseUser.getIdToken()
    return await this.loginInnoway()
  }

  async loginGoogle(brandName: string) {
    this.manuallyLogin = true
    this.innowayConfig.brandName = brandName
    const result = await this.firebaseApp.auth().signInWithPopup(this.googleProvider)
    this.googleToken = result.credential.accessToken
    this.firebaseUser = result.user
    this.firebaseToken = await this.firebaseUser.getIdToken()
    return await this.loginInnoway()
  }

  async loginInnoway() {
    if (this.firebaseToken && this.innowayConfig.brandName) {
      this.log('uid',this.firebaseUser.uid, this.firebaseUser)
      const option = {
        method: 'POST',
        uri: this.innowayConfig.apiUrl('auth/login_with_firebase'),
        headers: { //headers
          'User-Agent': 'Request-Promise'
        },
        json: true,
        body: {
          IdToken: this.firebaseToken,
          brand_name: this.innowayConfig.brandName
        }
      }
      let res = await this.exec(option)
      this.innowayUser = res.results.object
      this.adminToken = this.innowayUser.access_token
      this.innoway1.setAccessToken(this.innowayUser.access_token)
      innoway2.api.module('auth').loginWithToken(this.adminToken)
      this.onAuthStateChange.next(true)
    } else {
      this.onAuthStateChange.next(false)
      return null
    }
  }

  async logout() {
    await this.firebaseApp.auth().signOut()
    this.adminToken = undefined
    this.facebookToken = undefined
    this.firebaseToken = undefined
    this.firebaseUser = undefined
    this.googleToken = undefined
    this.innowayUser = undefined
    this.onAuthStateChange.next(false)
    return true
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.onAuthStateChange.getValue() != undefined) {
        resolve(this.onAuthStateChange.getValue() as boolean)
      } else {
        let subscription = this.onAuthStateChange.subscribe(state => {
          if (state && subscription) {
            resolve(state as boolean)
            subscription.unsubscribe()
          }
        })
      }
    })
  }

  async getUsers() {
    const users = await this.firebaseApp.database().ref('users').once('value')
    return users.val() as iUserRecords
  }

  async getUserInfo(userId: string) {
    const user = await this.firebaseApp.database().ref(`users/${userId}`).once('value')
    return user.val() as iUserRecord
  }

  async findUsers(email: string) {
    const users = await this.firebaseApp.database().ref(`users`)
      .orderByChild('email')
      .startAt(email)
      .endAt(email + "\uf8ff")
      .limitToFirst(5)
      .once("value")
    return users.val() as iUserRecords
  }

  async sendVerifyEmail() {
    this.firebaseUser.sendEmailVerification({
      url: this.innowayConfig.config.uiHost
    })
  }

}

export interface iUserRecord {
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  phoneNumber: string
}

export interface iUserRecords {
  [uid: string]: iUserRecord
}

export interface iInnowayUser {
  access_token: string
  avatar: string
  branch_id: string
  brand_id: string
  created_at: string
  email: string
  employee_type: string
  fullname: string
  id: string
  password: string
  phone: string
  rate: number
  status: number
  updated_at: string
  user_id: string
  username: string
}