import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-config-chatbot-story',
  templateUrl: './config-chatbot-story.component.html',
  styleUrls: ['./config-chatbot-story.component.scss']
})
export class ConfigChatbotStoryDialog implements OnInit {

  info = {};

  constructor(
    public dialogRef: MatDialogRef<ConfigChatbotStoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.data.inputs.forEach(e => {
      this.info[e.property] = e.current;
    });
    console.log(this.info);
  }

  onYesClick() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
