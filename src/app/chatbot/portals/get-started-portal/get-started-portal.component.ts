import { Component, OnInit, Input, Output , EventEmitter } from '@angular/core';
import { PageService } from '../../services/page.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-get-started-portal',
  templateUrl: './get-started-portal.component.html',
  styleUrls: ['./get-started-portal.component.scss']
})
export class GetStartedPortalComponent implements OnInit {
  @Input() stackIndex:number;
  @Output() onLoaded = new EventEmitter<any>();
  @Input() setting:any;
  @Input() page:any;
  @Output() onStorySelected = new EventEmitter<any>();
  
  public stories = new BehaviorSubject<Array<any>>([]);
  public items = [];
  public getStartedStory:any;

  constructor(
    private pageService: PageService
  ) { 
  }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.setting
    })
    this.stories = this.pageService.getStories(this.page.access_token);
    this.stories.subscribe(stories =>{
      console.log("STORIES",stories);
      this.items = stories.map(story =>{
        return {
          id: story._id,
          text: story.title
        }
      })
    })
    this.pageService.getStartedStory(this.page.access_token).then(story =>{
      console.log("GET STARTED STORY",story);
      this.getStartedStory = story;
    })
  }

  private value:any = ['Athens'];

  public selected(value:any):void {
    this.pageService.getStory(this.page.access_token,value.id).then(story =>{
      console.log('Selected value is: ', story);
      this.getStartedStory = story;
      this.onStorySelected.emit({
        index: this.stackIndex,
        data: story
      });
    })
  }

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }

  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.text;
      }).join(',');
  }

  public selectGetStartedStory(){
    this.onStorySelected.emit({
      index: this.stackIndex,
      data: this.getStartedStory
    })
  }

  public save(){
    this.pageService.setStartedStory(this.getStartedStory).then(success =>{
      console.log("SUCCESS",success);
    })
  }

}
