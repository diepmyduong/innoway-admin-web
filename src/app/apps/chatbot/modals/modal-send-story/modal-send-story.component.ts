import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup} from '@angular/forms';
import { SendStoryFormGroup, SendStoryValidateMessages } from '../../forms/send-story.groups';
import { PageService } from '../../services/page.service';
import { ActivatedRoute } from '@angular/router';

export class SendStoryModalContext extends BSModalContext {
  public type: string;
}

@Component({
  selector: 'app-modal-send-story',
  templateUrl: './modal-send-story.component.html',
  styleUrls: ['./modal-send-story.component.scss']
})
export class ModalSendStoryComponent implements OnInit,CloseGuard, ModalComponent<SendStoryModalContext> {

  context: SendStoryModalContext;
  frmSend: FormGroup;
  stories = [];
  page:any;

  constructor(
    public dialog: DialogRef<SendStoryModalContext>,
    private fb: FormBuilder,
    private pageService:PageService,
    private route:ActivatedRoute
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.frmSend = SendStoryFormGroup(this.fb);
    var pid = this.route.snapshot.params.pid;
    this.page = this.pageService._pages[pid];
    this.frmSend.controls['type'].setValue(this.context.type);
    this.pageService.getStories(this.page).subscribe(stories =>{
      this.stories = stories.map(story =>{
        return {
          id: story._id,
          text: story.title
        }
      })
    });
    
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

  send(){
    if(this.frmSend.valid){
      var data:any = {
        type: this.frmSend.controls["type"].value
      };
      switch(data.type){
        case "text":
          data.text = this.frmSend.controls["text"].value;
          break;
        case "story":
          data.story = this.frmSend.controls["story"].value;
          break;
        default:
          return;
      }
      this.dialog.close(data);
    }
  }

  public selected(value:any):void {
    this.frmSend.controls.story.setValue(value.id);
    // this.pageService.getStory(this.page,value.id).then(story =>{
    //   console.log('Selected value is: ', story);
    // })
  }

}
