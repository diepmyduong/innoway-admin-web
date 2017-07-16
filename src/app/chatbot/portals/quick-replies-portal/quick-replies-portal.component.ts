import { Component, OnInit,Input, Output , EventEmitter, NgZone } from '@angular/core';
import { PageService } from '../../services/page.service';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { QuickRepliesItemModalContext, ModalQuickRepliesItemComponent } from '../../modals/modal-quick-replies-item/modal-quick-replies-item.component';

@Component({
  selector: 'app-quick-replies-portal',
  templateUrl: './quick-replies-portal.component.html',
  styleUrls: ['./quick-replies-portal.component.scss']
})
export class QuickRepliesPortalComponent implements OnInit {

  @Input() stackIndex:number;
  @Input() story:any;
  @Input() card:any;
  @Output() onLoaded = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>(); 
  @Output() onPostbackSelected = new EventEmitter<any>();
  
  page:any;
  quick_replies = [];

  constructor(
    private modal: Modal,
    private zone: NgZone,
    private pageService: PageService,
  ) { }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.card
    })
    this.page = this.story._page;
    if(this.card.data.quick_replies){
      this.quick_replies = this.card.data.quick_replies;
    }
    
  }

  closePortal(){
    this.onClose.emit({
      index: this.stackIndex
    })
  }

  editItem(index){
    
    var reply = this.quick_replies[index];
    console.log("Edit item at ",reply);
    var option = {
      type: reply.content_type
    }
    switch(reply.content_type){
      case 'text':
        option = Object.assign(option,{
          data: {
            title: reply.title,
            payload: reply.payload,
            image_url: reply.image_url
          }
        })
        break;
      default:
        break;
    }
    this.showModal("quick_reply",option).then(modal =>{
      modal.result.then(res =>{
        if(res){
          this.card.data.quick_replies[index] = res;
          console.log("CARD",this.card);
          this.pageService.updateCard(this.story,this.card).then(success =>{
            // this.zone.run(()=>{this.card = success;})
          });
        }
      })
    })
  }

  removeItem(index){
    console.log("Remove item at ",index);
    this.card.data.quick_replies.splice(index,1);
    if(this.card.data.quick_replies.length == 0){
      delete this.card.data.quick_replies;
    }
    this.pageService.updateCard(this.story,this.card).then(success =>{
      // this.zone.run(()=>{this.card = success;})
    });
  }

  addItem(){
    console.log("Add item");
    var option = {
      type: 'text',
      data: {
        title: "",
        payload: "",
        image_url: "",
      }
    }
    this.showModal("quick_reply",option).then(modal =>{
      modal.result.then(res =>{
        if(res){
          if(!this.card.data.quick_replies){
            this.card.data.quick_replies = [];
            this.quick_replies = this.card.data.quick_replies;
          }
          if(this.card.data.quick_replies.length < 11){
            this.card.data.quick_replies.push(res);
            console.log("CARD",this.card);
            this.pageService.updateCard(this.story,this.card).then(success =>{
              // this.zone.run(()=>{this.card = success;})
            });
          }
        }
      })
    })
  }

  showStory(index){
    console.log("Show story",index);
    var item = this.quick_replies[index];
    this.pageService.getStory(this.page,item.payload).then((story:any) =>{
      this.onPostbackSelected.emit({
        index: this.stackIndex,
        data: story._story
      });
    })
  }

  showModal(type,option = {}){
    switch (type) {
      case "quick_reply":
        return this.modal.open(ModalQuickRepliesItemComponent, 
        overlayConfigFactory(option,QuickRepliesItemModalContext));
      default:
        break;
    }
  }

}
