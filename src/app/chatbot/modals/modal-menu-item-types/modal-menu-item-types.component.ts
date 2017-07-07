import { Component, OnInit, NgZone } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';
import { FormBuilder , FormGroup} from '@angular/forms';
import { MenuItemFormGroup, MenuItemValidateMessages } from '../../forms/menuItem.groups';
import { PageService } from '../../services/page.service';

export class MenuItemTypesModalContext extends BSModalContext {
  public type: string;
  public data: any;
}

@Component({
  selector: 'app-modal-menu-item-types',
  templateUrl: './modal-menu-item-types.component.html',
  styleUrls: ['./modal-menu-item-types.component.scss']
})
export class ModalMenuItemTypesComponent implements OnInit,CloseGuard, ModalComponent<MenuItemTypesModalContext> {

  context: MenuItemTypesModalContext;
  frmMenuItem: FormGroup;
  stories = [];
  activeStory = [];

  constructor(
    public dialog: DialogRef<MenuItemTypesModalContext>,
    private fb: FormBuilder,
    private pageService:PageService,
    private zone:NgZone
  ) { 
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.frmMenuItem = MenuItemFormGroup(this.fb);
    this.frmMenuItem.controls['type'].setValue(this.context.type);
    this.frmMenuItem.controls['title'].setValue(this.context.data.title);
    if(this.context.data.url){
      this.frmMenuItem.controls['url'].setValue(this.context.data.url);
    }
    
    this.pageService.getStories(this.context.data.page.access_token).subscribe(stories =>{
      this.stories = stories.map(story =>{
        
        if(this.context.data.payload && story._id === this.context.data.payload){
          this.zone.run(()=>{
            this.frmMenuItem.controls['payload'].setValue(this.context.data.payload);
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
    if(this.frmMenuItem.valid){
      var data:any = {
        type: this.frmMenuItem.controls["type"].value,
        title: this.frmMenuItem.controls["title"].value
      };
      switch(data.type){
        case "web_url":
          data.url = this.frmMenuItem.controls["url"].value;
          break;
        case "postback":
          data.payload = this.frmMenuItem.controls["payload"].value;
          break;
        case "nested":
          break;
        default:
          return;
      }
      this.dialog.close(data);
    }
  }

  public selected(value:any):void {
    this.frmMenuItem.controls.payload.setValue(value.id);
    this.pageService.getStory(this.context.data.page.access_token,value.id).then(story =>{
      console.log('Selected value is: ', story);
      // this.getStartedStory = story;
      // this.onStorySelected.emit({
      //   index: this.stackIndex,
      //   data: story
      // });
    })
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.text;
      }).join(',');
  }

}
