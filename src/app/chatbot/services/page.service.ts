import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
declare var innoway_chatbot:any,$:any;

@Injectable()
export class PageService {

  public pages:BehaviorSubject<Array<any>>;
  public _pages:any =  {};

  constructor(
    private auth: AuthService,
    private router: Router
  ) { 
    $(auth.user).on(innoway_chatbot.User.EventTypes.PAGE_STATECHANGE,()=>{
      console.log("PAGE CHANGE");
      this.auth.user.getPages((err,res)=>{
        if(!err){
          this.pages.next(res.data);
        }
      })
    })
  }

  getPages(){
    if(!this.pages) {
      this.pages = new BehaviorSubject<Array<any>>([]);
      this.auth.user.getPages((err,res)=>{
        if(err){
          this.pages.error(err);
        }else{
          res.data.forEach(page =>{
            this._pages[page.id] = page;
          });
          this.pages.next(res.data);
        }
      })
    }
    return this.pages;
  }

  subscribe(page){
    return new Promise((resolve,reject)=>{
      this.auth.user.subscribePage(page.access_token,(err,data)=>{
        if(err){
          reject(err);
          return;
        }
        //Default Setting
        var pageOb = new innoway_chatbot.Page(page.access_token);
        pageOb.activeSetting({
          "type":"get_started",
          "setting": {
            "payload": "GET_STARTED_PAYLOAD"
          }
        })
        pageOb.activeSetting({
          "type":"greeting",
          "setting": {
            "text": "Xin chào bạn!"
          }
        });
        pageOb.activeSetting({
          "type":"persistent_menu",
          "setting": {
            "call_to_actions": [
            ]
          }
        })
        resolve(data);
      })
    })
  }

  unsubscribe(page){
    return new Promise((resolve,reject)=>{
      this.auth.user.unSubscribePage(page.access_token,(err,data)=>{
        if(err){
          reject(err);
          return;
        }
        var pageOb = new innoway_chatbot.Page(page.access_token);
        pageOb.deActiveSetting([
          "greeting",
          "persistent_menu",
          "get_started"
        ])
        resolve(data);
        
      });
    })
  }

  getPage(page_token){
    return new Promise((resolve,reject)=>{
      this.auth.user.getPageInfo(page_token,(err,data)=>{
        if(err){
          reject(err);
        }else{
          this._pages[data.id] = data;
          resolve(data);
        }
      })
    })
  }

  getPageWithId(pid){
    return new Promise((resolve,reject)=>{
      this.auth.user.getPageInfoWithId(pid,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  getPageSettings(page_token){
    return new Promise((resolve,reject)=>{
      var page = new innoway_chatbot.Page(page_token);
      page.getSettings((err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    });
  }

  activeSetting(page_token,setting){
    return new Promise((resolve,reject)=>{
      var page = new innoway_chatbot.Page(page_token);
      page.activeSetting(setting,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  deactiveSettings(page_token,types){
    return new Promise((resolve,reject)=>{
      var page = new innoway_chatbot.Page(page_token);
      page.activeSetting(types,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  getStories(page_token){
    var page = new innoway_chatbot.Page(page_token);
    var story = new BehaviorSubject<Array<any>>([]);
    page.getStories((err,data)=>{
      if(err) story.error(err);
      else story.next(data);
    });
    return story;
  }

  getStory(page_token,story_id){
    return new Promise((resolve,reject)=>{
      var page = new innoway_chatbot.Page(page_token);
      page.getStory(story_id,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  getStartedStory(page_token){
    return new Promise((resolve,reject)=>{
      var page = new innoway_chatbot.Page(page_token);
      page.getStartedStory((err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  setStartedStory(story){
    return new Promise((resolve,reject)=>{
      story.setAsGetStarted((err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

}
