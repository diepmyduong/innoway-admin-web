import { Component, OnInit,Output, EventEmitter ,Input, NgZone} from '@angular/core';
import { PageService } from '../../services/page.service';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { StoryModalContext, ModalStoryComponent } from '../../modals/modal-story/modal-story.component';
@Component({
  selector: 'app-stories-portal',
  templateUrl: './stories-portal.component.html',
  styleUrls: ['./stories-portal.component.scss']
})
export class StoriesPortalComponent implements OnInit {
  @Input() stackIndex:number = 0;
  @Input() page:any;
  @Output() onLoaded = new EventEmitter<any>();
  @Output() onStorySelected = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  stories = [];
  constructor(
    private pageService:PageService,
    private zone: NgZone,
    private modal : Modal
  ) {
  }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.stories
    })
    if(this.page){
      this.pageService.getStories(this.page).subscribe(stories =>{
        this.zone.run(()=>{
          this.stories = stories;
        });
      });
    }
    
  }

  selectStory(story){
    this.onStorySelected.emit({
      index: this.stackIndex,
      data: story
    });
  }
  
  showModal(type,data = {}){
    switch (type) {
      case "story":
        return this.modal.open(ModalStoryComponent, 
          overlayConfigFactory(data,StoryModalContext));
      default:
        break;
    }
  }

  editStory(story){
    console.log("EDIT STORY",story);
    this.showModal("story",{
      title: story.title
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          var storyObject = this.page.buildStory(story);
          this.pageService.updateStory(storyObject,res.title).then(success =>{
            this.selectStory(success);
            console.log("EDIT STORY",success);
          })
        }
      });
    });
  }

  newStory(){
    this.showModal("story",{
      title: "New story"
    }).then(modal =>{
      modal.result.then(res =>{
        if(res){
          this.pageService.addStory(this.page,res.title).then((success:any) =>{
            this.selectStory(success._story);
            console.log("NEW STORY",success);
          })
        }
      });
    });
  }

  removeStory(story){
    this.modal.confirm()
      .title("Xoá Story")
      .okBtn("Xoá")
      .cancelBtn("Huỷ")
      .size("sm")
      .message("Bạn có chắc muốn xoá Story này")
      .open()
      .catch(err =>{}).then((modal:any) =>{
        modal.result.then(res =>{
          if(res){
            var storyObject = this.page.buildStory(story);
            this.pageService.removeStory(storyObject);
          }
        })
      })
  } 

  closePortal(){
    this.onClose.emit({
      index: this.stackIndex
    })
  }

}
