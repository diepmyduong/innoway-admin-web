import { Component, OnInit,NgZone } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup} from '@angular/forms';
import { PageService } from '../../services/page.service';
import { ActivatedRoute } from '@angular/router';
import { QuickRepliesItemFormGroup,QuickRepliesItemValidateMessages} from '../../forms/quickRepliesItem.groups';
export class QuickRepliesItemModalContext extends BSModalContext {
  public type: string;
  public data: any;
}

@Component({
  selector: 'app-modal-quick-replies-item',
  templateUrl: './modal-quick-replies-item.component.html',
  styleUrls: ['./modal-quick-replies-item.component.scss']
})
export class ModalQuickRepliesItemComponent implements OnInit,CloseGuard, ModalComponent<QuickRepliesItemModalContext> {

  context: QuickRepliesItemModalContext;
  frmQuickReply: FormGroup;
  stories = [];
  activeStory = [];
  page:any;

  constructor(
    public dialog: DialogRef<QuickRepliesItemModalContext>,
    private fb: FormBuilder,
    private pageService:PageService,
    private zone:NgZone,
    private activatedRoute:ActivatedRoute
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    console.log("QUICK REPLY MODAL",this.context);
    this.frmQuickReply = QuickRepliesItemFormGroup(this.fb);
    var pid = this.activatedRoute.snapshot.params.pid;
    this.page = this.pageService._pages[pid];
    this.frmQuickReply.controls['content_type'].setValue(this.context.type);
    if(this.context.type === 'text'){
      this.frmQuickReply.controls['title'].setValue(this.context.data.title);
      this.pageService.getStories(this.page).subscribe(stories =>{
        this.stories = stories.map(story =>{
          if(this.context.data.payload && story._id === this.context.data.payload){
            this.zone.run(()=>{
              this.frmQuickReply.controls['payload'].setValue(this.context.data.payload);
              this.activeStory = [{
                id: story._id,
                text: story.title
              }];
            });
          }
          return {
            id: story._id,
            text: story.title
          }
        })
      });
      this.frmQuickReply.controls['image_url'].setValue(this.context.data.image_url);
    }
    if(this.context.data.url){
      this.frmQuickReply.controls['url'].setValue(this.context.data.url);
    }
    
    
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return false;
  }

  closeModal(){
    this.dialog.close();
  }

  add(){
    if(this.frmQuickReply.valid){
      var data:any = {
        content_type: this.frmQuickReply.controls["content_type"].value
      };
      switch(data.content_type){
        case "text":
          data.payload = this.frmQuickReply.controls["payload"].value;
          data.title = this.frmQuickReply.controls["title"].value;
          if(this.frmQuickReply.controls["image_url"]){
            data.image_url = this.frmQuickReply.controls["image_url"].value;
          }
          break;
        default:
          return;
      }
      this.dialog.close(data);
    }
  }

  public selected(value:any):void {
    this.frmQuickReply.controls.payload.setValue(value.id);
    this.pageService.getStory(this.page,value.id).then(story =>{
      console.log('Selected value is: ', story);
      // this.getStartedStory = story;
      // this.onStorySelected.emit({
      //   index: this.stackIndex,
      //   data: story
      // });
    })
  }

}
