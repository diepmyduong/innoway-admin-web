import { Component, OnInit ,Input, Output , EventEmitter, NgZone} from '@angular/core';
import { PageService } from '../../services/page.service';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { MenuItemTypesModalContext, ModalMenuItemTypesComponent } from '../../modals/modal-menu-item-types/modal-menu-item-types.component';

@Component({
  selector: 'app-submenu-portal',
  templateUrl: './submenu-portal.component.html',
  styleUrls: ['./submenu-portal.component.scss']
})
export class SubmenuPortalComponent implements OnInit {

  @Input() stackIndex:number;
  @Output() onLoaded = new EventEmitter<any>();
  @Input() level:any;
  @Input() page:any;
  @Output() onPostbackSelected = new EventEmitter<any>();
  @Output() onNestedMenuSelected = new EventEmitter<any>();

  action: any;
  setting: any;

  constructor(
    private modal: Modal,
    private zone: NgZone,
    private pageService: PageService,
  ) { 
    
  }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.setting
    })
    this.setting = this.getSetting();
    console.log("SETTING",this.setting);
    this.action = this.setting.data.call_to_actions[this.level[0]];
    console.log('first level',this.action);
    for(var i = 1; i < this.level.length; i++){
      
      this.action = this.action.call_to_actions[this.level[i]];
      console.log('level'+i,this.action);
    }
    
    
  }

  storeSetting(){
    // if(this.level.length = 1){
    //   this.setting.data.call_to_actions[this.level[0]] = this.action;
    // }else if(this.level.length = 2){
    //   this.setting.data.call_to_actions[this.level[0]].call_to_actions[this.level[1]] = this.action;
    // }
    sessionStorage.setItem('innoway-chatbot.setting.menu',JSON.stringify(this.setting));
  }

  getSetting(){
    return JSON.parse(sessionStorage.getItem('innoway-chatbot.setting.menu'));
  }

  addItem(){
      this.showModal('menu_item_type',{
        type: "nested",
        data: {
          title: "Menu Item",
          page : this.page
        }
      }).then(modal =>{
        modal.result.then(res =>{
        if(res && this.action.call_to_actions.length < 5){
          if(res.type == "nested" && this.level.length == 2) return;
          if(res.type == "nested"){
            res.call_to_actions = [];
          }
          this.action.call_to_actions.push(res);
          this.storeSetting();
          console.log("RESULT",this.action);
        }
      })
    });
  }

  showModal(type,data = {}){
    switch (type) {
      case "menu_item_type":
        return this.modal.open(ModalMenuItemTypesComponent, 
          overlayConfigFactory(data,MenuItemTypesModalContext));
      default:
        break;
    }
  }

  editItem(action,index){
    console.log("SELECT ITEM",action);
    switch(action.type){
      case "web_url":
        this.showModal("menu_item_type",{
          type : action.type,
          data: {
            title: action.title,
            page: this.page,
            url: action.url
          }
        }).then(modal =>{
          modal.result.then(res =>{
            if(res){
              this.action.call_to_actions[index] = res;
              this.storeSetting();
              console.log("RESULT",this.action);
            }
          });
        });
        break;
      case "postback":
        this.showModal("menu_item_type",{
          type : action.type,
          data: {
            title: action.title,
            page: this.page,
            payload: action.payload
          }
        }).then(modal =>{
          modal.result.then(res =>{
            if(res){
              this.action.call_to_actions[index] = res;
              this.storeSetting();
              console.log("RESULT",this.action);
            }
          });
        });
        break;
      case "nested":
        this.showModal("menu_item_type",{
          type : action.type,
          data: {
            title: action.title,
            page: this.page,
          }
        }).then(modal =>{
          modal.result.then(res =>{
            if(res){
              if(res.type == "nested"){
                var setting = this.getSetting();
                this.action.call_to_actions[index] =  Object.assign(setting.data.call_to_actions[this.level[0]].call_to_actions[index],res);
              }else{
                this.action.call_to_actions[index] = res;
              }
              this.storeSetting();
              console.log("RESULT",this.action);
            }
          });
        });
        break;
      default:
        return;
    }
  }

  removeItem(index){
    this.action.call_to_actions.splice(index, 1);
    
  }

  showStory(action){
    this.pageService.getStory(this.page.access_token,action.payload).then(story =>{
      console.log('Selected value is: ', story);
      this.onPostbackSelected.emit({
        index: this.stackIndex,
        data: story
      });
    })
  }

  showNestedMenu(action,index){
    var data = this.level.slice();
    data.push(index);
    this.onNestedMenuSelected.emit({
      index: this.stackIndex,
      data: data
    })
  }

  save(){
    this.storeSetting();
  }

}
