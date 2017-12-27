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

    this.getStories();
    this.validateInputData();
  }

  validateInputData() {


    this.error = null;


    this.ref.detectChanges();
  }


  onYesClick() {
    this.sendMessage();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async getStories() {
    try {
      let response = await this.innowayApi.thirdpartyChatbot.getStories();
      this.stories = response.rows;
      this.story = this.stories[0]._id;
      console.log("getStories", response);
    } catch (err) {
      console.log(err);
    }
  }

  async sendMessage() {
    try {
      console.log("send story", JSON.stringify(this.story))
      let response = await this.innowayApi.thirdpartyChatbot.sendStory({
        story_id: this.story
      });
      console.log("send message", JSON.stringify(response))
      // let response = await this.innowayApi.thirdpartyChatbot.sendSampleStory();
      // console.log("getStories", response);
      alert(true)
    } catch (err) {
      console.log("send message", err)
      alert(false)
    }
  }

}
