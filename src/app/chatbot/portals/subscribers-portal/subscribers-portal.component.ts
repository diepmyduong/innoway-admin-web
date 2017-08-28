import { Component, OnInit,Output, EventEmitter ,Input} from '@angular/core';
import { PageService } from '../../services/page.service';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { SendStoryModalContext, ModalSendStoryComponent } from '../../modals/modal-send-story/modal-send-story.component';
@Component({
  selector: 'app-subscribers-portal',
  templateUrl: './subscribers-portal.component.html',
  styleUrls: ['./subscribers-portal.component.scss']
})
export class SubscribersPortalComponent implements OnInit {

  @Input() stackIndex:number = 0;
  @Input() page:any;
  @Output() onLoaded = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  subscribers = []
  selected = {}
  constructor(
    private pageService:PageService,
    private modal : Modal
  ) { }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.subscribers
    })
    if(this.page){
      this.getSubscribers();
    }
    
  }

  getSubscribers(){
    this.pageService.getSubscribers(this.page).then((subs:any) =>{
      this.subscribers = subs;
      console.log('loaded subscriber',this.subscribers);
    })
  }

  closePortal(){
    this.onClose.emit({
      index: this.stackIndex
    })
  }

  selectSubscirber(index){
    var sub = this.subscribers[index];
    if(this.selected[sub._id]){
      delete this.selected[sub._id];
    }else{
      this.selected[sub._id] = sub;
    }
  }

  showModal(type,option = {}){
    switch (type) {
      case "send_story":
        return this.modal.open(ModalSendStoryComponent, 
        overlayConfigFactory(option,SendStoryModalContext));
      default:
        break;
    }
  }

  sendStory(){
    this.showModal('send_story',{
      type: "story"
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          switch(res.type){
            case "text":
              break;
            case "story":
              console.log("send story",res.story);
              this.sendStoryToSubscriber(res.story);
              break;
          }
        }
      })
    })
  }

  private sendStoryToSubscriber(story_id){
    this.pageService.sendToSubscribers(this.page,story_id,Object.keys(this.selected)).then(success =>{
      console.log("send success");
    })
  }

  

}
