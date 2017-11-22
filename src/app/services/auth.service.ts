import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare var innoway2,$:any;
@Injectable()
export class AuthService {

  constructor() {
    this.service = innoway2.api.module('auth');

  }

  service:any;
  
  async getAuthState(){
    let state = await this.service.getAuthState();
    let obState = new BehaviorSubject<boolean>(state);
    $(this.service).on('on_auth_change',((e,state)=>{
      obState.next(state);
    }).bind(this));
    return obState;
  }

  async loginWithEmailAndPassword(email,password){
    return await this.service.LoginWithEmailAndPassword(email,password)
  }

  async getAccessToken() {
    return await innoway2.api.getAccessToken()
  }

}
