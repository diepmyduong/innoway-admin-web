import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


declare var innoway_chatbot:any,$:any;

@Injectable()
export class AuthService {

  private _user:any;
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(
  ) { 
    var self = this;
    this._user = new innoway_chatbot.User();
    $(this._user).on(innoway_chatbot.User.EventTypes.AUTHENTICATE_STATECHANGE,(e,state)=>{
      self.setLoggedIn(state);
      // console.log("AUTHENTICATE_STATECHANGE",state);
    })
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    // console.log("SET LOGIN",value);
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  loginWithFacebook(){
    return new Promise((resolve,reject)=>{
      this._user.loginWithFacebook((err,data)=>{
        if(err){
          reject(data);
        }else{
          resolve(data);
        }
      })
    });
  }

  logout(){
    this._user.logout();
  }
  
  get authenticated() {
    // Check if there's an unexpired access token
    return this._user.authenticated;
  }

  get user(){
    return this._user;
  }

}
