import { Component, OnInit ,Input, Output , EventEmitter, NgZone} from '@angular/core';
import { PageService } from '../../services/page.service';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { MenuItemTypesModalContext, ModalMenuItemTypesComponent } from '../../modals/modal-menu-item-types/modal-menu-item-types.component';

@Component({
  selector: 'app-menu-portal',
  templateUrl: './menu-portal.component.html',
  styleUrls: ['./menu-portal.component.scss']
})
export class MenuPortalComponent implements OnInit {

  @Input() stackIndex:number;
  @Output() onLoaded = new EventEmitter<any>();
  @Input() setting:any;
  @Input() page:any;
  @Output() onPostbackSelected = new EventEmitter<any>();
  @Output() onNestedMenuSelected = new EventEmitter<any>();

  constructor(
    private modal: Modal,
    private zone: NgZone,
    private pageService: PageService,
  ) { }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.setting
    })
    this.storeSetting();
    console.log("SETTING",this.setting);
    
  }

  storeSetting(){
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
        if(res && this.setting.data.call_to_actions.length < 3){
          if(res.type == "nested"){
            res.call_to_actions = [];
          }
          this.setting.data.call_to_actions.push(res);
          this.storeSetting()
          console.log("RESULT",this.setting);
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
              this.setting.data.call_to_actions[index] = res;
              this.storeSetting()
              console.log("RESULT",this.setting);
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
              this.setting.data.call_to_actions[index] = res;
              this.storeSetting()
              console.log("RESULT",this.setting);
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
                this.setting.data.call_to_actions[index] =  Object.assign(setting.data.call_to_actions[index],res);
              }else{
                this.setting.data.call_to_actions[index] = res;
              }
              this.storeSetting()
              console.log("RESULT",this.setting);
            }
          });
        });
        break;
      default:
        return;
    }
  }

  removeItem(index){
    this.setting.data.call_to_actions.splice(index, 1);
    this.storeSetting()
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
    this.onNestedMenuSelected.emit({
      index: this.stackIndex,
      data: [index]
    })
  }

  save(){
    var setting = this.getSetting();
    this.pageService.activeSetting(this.page.access_token,{
      type: "persistent_menu",
      setting: setting.data
    }).then(success =>{
      console.log("SUCCESS",success);
    })
  }

}
