import { Component, OnInit ,NgZone} from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup} from '@angular/forms';
import { MenuItemFormGroup, MenuItemValidateMessages } from '../../forms/menuItem.groups';
import { PageService } from '../../services/page.service';
import { ActivatedRoute } from '@angular/router';

export class ButtonTypesModalContext extends BSModalContext {
  public type: string;
  public data: any;
}
@Component({
  selector: 'app-modal-button-types',
  templateUrl: './modal-button-types.component.html',
  styleUrls: ['./modal-button-types.component.scss']
})
export class ModalButtonTypesComponent implements OnInit,CloseGuard, ModalComponent<ButtonTypesModalContext> {

  context: ButtonTypesModalContext;
  frmButton: FormGroup;
  stories = [];
  activeStory = [];
  page:any;

  constructor(
    public dialog: DialogRef<ButtonTypesModalContext>,
    private fb: FormBuilder,
    private pageService:PageService,
    private zone:NgZone,
    private activatedRoute:ActivatedRoute
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.frmButton = MenuItemFormGroup(this.fb);
    var pid = this.activatedRoute.snapshot.params.pid;
    this.page = this.pageService._pages[pid];
    this.frmButton.controls['type'].setValue(this.context.type);
    this.frmButton.controls['title'].setValue(this.context.data.title);
    if(this.context.data.url){
      this.frmButton.controls['url'].setValue(this.context.data.url);
    }
    this.pageService.getStories(this.page).subscribe(stories =>{
      this.stories = stories.map(story =>{
        
        if(this.context.data.payload && story._id === this.context.data.payload){
          this.zone.run(()=>{
            this.frmButton.controls['payload'].setValue(this.context.data.payload);
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
    if(this.frmButton.valid){
      var data:any = {
        type: this.frmButton.controls["type"].value,
        title: this.frmButton.controls["title"].value
      };
      switch(data.type){
        case "web_url":
          data.url = this.frmButton.controls["url"].value;
          break;
        case "postback":
          data.payload = this.frmButton.controls["payload"].value;
          break;
        default:
          return;
      }
      this.dialog.close(data);
    }
  }

  public selected(value:any):void {
    this.frmButton.controls.payload.setValue(value.id);
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

