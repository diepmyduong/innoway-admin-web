import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from "@angular/router";
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
            this._pages[page.id] = new innoway_chatbot.Page(page.access_token);
            this._pages[page.id].data = page;
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
          this._pages[data.id] = new innoway_chatbot.Page(data.access_token);
          this._pages[data.id].data = data;
          resolve(data);
        }
      })
    })
  }

  getPageWithId(pid){
    return new Promise((resolve,reject)=>{
      this.auth.user.getPageInfoWithId(pid,(err,data)=>{
        if(err) reject(err);
        else {
          this._pages[pid] = new innoway_chatbot.Page(data.access_token);
          this._pages[pid].data = data;
          resolve(data);
        }
      })
    })
  }

  // SETTING

  getPageSettings(pageObject){
    return new Promise((resolve,reject)=>{
      // var page = new innoway_chatbot.Page(page_token);
      pageObject.getSettings((err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    });
  }

  activeSetting(pageObject,setting){
    return new Promise((resolve,reject)=>{
      // var page = new innoway_chatbot.Page(page_token);
      pageObject.activeSetting(setting,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  deactiveSettings(pageObject,types){
    return new Promise((resolve,reject)=>{
      // var page = new innoway_chatbot.Page(page_token);
      pageObject.activeSetting(types,(err,data)=>{
        if(err) reject(err);
        else resolve(data); 
      })
    })
  }

  //=== STORIES

  getStories(pageObject){
    // var page = new innoway_chatbot.Page(page_token);
    var story = new BehaviorSubject<Array<any>>([]);
    $(pageObject).on(innoway_chatbot.Page.EventTypes.STORY_CHANGE,(change)=>{
      console.log("STORY Change",change);
      pageObject.getStories((err,data)=>{
        if(err) story.error(err);
        else story.next(data);
      });
    })
    pageObject.getStories((err,data)=>{
      if(err) story.error(err);
      else story.next(data);
    });
    return story;
  }

  getStory(pageObject,story_id){
    return new Promise((resolve,reject)=>{
      // var page = new innoway_chatbot.Page(page_token);
      pageObject.getStory(story_id,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  getStartedStory(pageObject){
    return new Promise((resolve,reject)=>{
      // var page = new innoway_chatbot.Page(page_token);
      pageObject.getStartedStory((err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  setStartedStory(storyObject){
    return new Promise((resolve,reject)=>{
      storyObject.setAsGetStarted((err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  updateStory(storyObject,title){
    return new Promise((resolve,reject)=>{
      storyObject.update(title,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  addStory(pageObject,title = null){
    return new Promise((resolve,reject)=>{
      pageObject.newStory(title,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  removeStory(storyObject){
    return new Promise((resolve,reject)=>{
      storyObject.destroy((err,res)=>{
        if(err) reject(err);
        else resolve(res);
      })
    })
  }

  //=== STORY
  getCards(storyObject){
    return new Promise((resolve,reject)=>{
      storyObject.getCards((err,res)=>{
        if(err) reject(err)
        else resolve(res);
      });
    })
  }

  getKeys(storyObject){
    return new Promise((resolve,reject)=>{
      storyObject.getKeys((err,res)=>{
        if(err) reject(err)
        else resolve(res);
      })
    })
  }

  addTextCard(storyObject,data){
    return new Promise((resolve,reject)=>{
      storyObject.addCard({
        type: "text",
        data: data
      },(err,res)=>{
        if(err) reject(err);
        else resolve(res);
      })
    })
  }

  addButtonCard(storyObject,data){
    return new Promise((resolve,reject)=>{
      storyObject.addCard({
        type: "buttons",
        data: data
      },(err,res)=>{
        if(err) reject(err);
        else resolve(res);
      })
    })
  }

  addGenericCard(storyObject,data){
    return new Promise((resolve,reject)=>{
      storyObject.addCard({
        type: "generic",
        data: data
      },(err,res)=>{
        if(err) reject(err);
        else resolve(res);
      })
    })
  }

  updateCard(storyObject,card){
    return new Promise((resolve,reject)=>{
      storyObject.updateCard(card,(err,res)=>{
        if(err) reject(err);
        else resolve(res);
      })
    })
  }

  removeCard(storyObject,card){
    return new Promise((resolve,reject)=>{
      storyObject.removeCard(card._id,(err,res)=>{
        if(err) reject(err);
        else resolve(res);
      })
    })
  }

  addKey(storyObject,key){
    return new Promise((resolve,reject)=>{
      storyObject.addKey(key,(err,res)=>{
        if(err) reject(err);
        else resolve(res);
      })
    })
  }

  //Subscribers
  getSubscribers(pageObject){
    return new Promise((resolve,reject)=>{
      pageObject.getSubscribers((err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  getSubscriber(pageObject,sub_id){
    return new Promise((resolve,reject)=>{
      pageObject.getSubscriber(sub_id,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  updateSubscriber(pageObject,sub_id,data){
    return new Promise((resolve,reject)=>{
      pageObject.editSubscriber(sub_id,data,(err,updated)=>{
        if(err) reject(err);
        else resolve(updated);
      })
    })
  }

  removeSubscriber(pageObject,sub_id){
    return new Promise((resolve,reject)=>{
      pageObject.removeSubscriber(sub_id,(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  sendToSubscribers(pageObject,story_id,sids){
    return new Promise((resolve,reject)=>{
      pageObject.sendToSubscribers({
        subscribers: sids,
        storyId: story_id
      },(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }

  sendToAllSubscribers(pageObject,story_id){
    return new Promise((resolve,reject)=>{
      pageObject.sendToAllSubscribers({
        storyId: story_id
      },(err,data)=>{
        if(err) reject(err);
        else resolve(data);
      })
    })
  }
}
