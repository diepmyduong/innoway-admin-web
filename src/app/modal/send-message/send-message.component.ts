import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Globals } from '../../globals'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { InnowayApiService } from "./../../services/innoway";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  providers: [Globals],
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageDialog implements OnInit {

  info = {};

  customerId: string;
  billId: string;
  contentInput: string;
  mediaLinkInput: string;

  address: string;
  longitude: number;
  latitude: number;

  mediaType: string = null;
  mediaTypes: any[] = [
    {
      name: "video",
      code: "video",
    },
    {
      name: "image",
      code: "image",
    }, {
      name: "audio",
      code: "audio",
    }
  ];

  error: string;
  isValid: boolean = false;

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(
    public dialogRef: MatDialogRef<SendMessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ref: ChangeDetectorRef,
    public innowayApi: InnowayApiService,
    private globals: Globals) { }

  ngOnInit() {
    console.log(this.data);


    this.validateInputData();
  }

  validateInputData() {
    this.error = null;
    this.isValid = true;

    this.ref.detectChanges();
  }


  onYesClick() {
    this.info["contentInput"] = this.contentInput
    this.info["mediaType"] = this.mediaType
    this.info["mediaLinkInput"] = this.mediaLinkInput
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // async sendMessage(input: any) {
  //   try {
  //     let request = {
  //       content: input.content,
  //       media: {
  //         type: input.media.type,
  //         link: input.media.link
  //       }
  //     }
  //     let data = await this.innowayApi.thirdpartyChatbot.sendMessageToCustomer(request);
  //     console.log("response", JSON.stringify(data))
  //   } catch (err) {
  //     console.log("response", err)
  //   }
  // }

}
