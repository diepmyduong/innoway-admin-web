import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Globals } from '../../globals'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { InnowayApiService } from "./../../services/innoway";

@Component({
  selector: 'app-send-story',
  providers: [Globals],
  templateUrl: './send-story.component.html',
  styleUrls: ['./send-story.component.scss']
})
export class SendStoryDialog implements OnInit {

  info = {};

  story: string;
  stories: any[];
  subscriberId: string;

  error: string;
  isValid: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SendStoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService,
    private globals: Globals) { }

  ngOnInit() {
    console.log(this.data);

    this.stories = this.data.stories ? this.data.stories : [];
    this.story = this.stories[0].id ? this.stories[0].id : null;
    this.subscriberId = this.data.susubscriberId ? this.data.susubscriberId : null;

    this.validateInputData();
  }

  validateInputData() {


    this.error = null;
    this.isValid = true;


    this.ref.detectChanges();
  }


  onYesClick() {
    this.info["storyId"] = this.story
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
