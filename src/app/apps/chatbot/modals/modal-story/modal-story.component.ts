import { Component, OnInit, NgZone } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup} from '@angular/forms';
import { StoryFormGroup, StoryValidateMessages } from '../../forms/story.groups';
import { PageService } from '../../services/page.service';

export class StoryModalContext extends BSModalContext {
  public title: any;
}

@Component({
  selector: 'app-modal-story',
  templateUrl: './modal-story.component.html',
  styleUrls: ['./modal-story.component.scss']
})
export class ModalStoryComponent implements OnInit,CloseGuard, ModalComponent<StoryModalContext> {

  context: StoryModalContext;
  frmStory: FormGroup;

  constructor(
    public dialog: DialogRef<StoryModalContext>,
    private fb: FormBuilder,
    private pageService:PageService,
    private zone:NgZone
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.frmStory = StoryFormGroup(this.fb);
    this.frmStory.controls['title'].setValue(this.context.title);
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
    if(this.frmStory.valid){
      var data:any = {
        title: this.frmStory.controls["title"].value
      };
      this.dialog.close(data);
    }
  }

}
