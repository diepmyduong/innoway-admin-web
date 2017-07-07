import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-story-portal',
  templateUrl: './story-portal.component.html',
  styleUrls: ['./story-portal.component.scss']
})
export class StoryPortalComponent implements OnInit {

  @Input() story:any;
  @Input() stackIndex:number;
  @Output() onLoaded = new EventEmitter<any>();

  public data:any;

  constructor() {
    
  }

  ngOnInit() {
    this.onLoaded.emit({
      index: this.stackIndex,
      data: this.story
    })
    console.log(this.story);
    this.data = this.story._story;
  }

}
