import { Component, OnInit,Output, EventEmitter ,Input} from '@angular/core';

@Component({
  selector: 'app-stories-portal',
  templateUrl: './stories-portal.component.html',
  styleUrls: ['./stories-portal.component.scss']
})
export class StoriesPortalComponent implements OnInit {
  @Input() stackIndex:number = 0;
  @Output() onLoaded = new EventEmitter<any>();
  @Output() onStorySelected = new EventEmitter<any>();
  stories = [
    {
      title: "Story A"
    },
    {
      title: "Story B"
    }
  ]

  constructor() {
  }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.stories
    })
  }

  selectStory(story){
    this.onStorySelected.emit({
      index: this.stackIndex,
      data: story
    });
  }

}
