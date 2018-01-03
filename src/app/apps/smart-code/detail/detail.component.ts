import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from 'app/services/innoway'
import { Globals } from "./../../../Globals"

import * as moment from 'moment';
declare var swal, _: any;

@Component({
  selector: 'app-detail',
  providers: [Globals],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  id: string
  submitting: boolean = false

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/];

  limit: number = 0
  amount: number = 0
  code: string
  content: string
  startTime: string
  endTime: string
  codeType: string
  codeTypes: any[]
  status: number = 1
  qrCodeImage: string
  messengerCodeImage: string
  link: string

  isConnectChatbot: boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globals: Globals,
    public innowayApi: InnowayApiService
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.codeTypes = this.globals.SMART_CODE_TYPES;

    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.smartCode.getItem(this.id, {
        query: {
          fields: ["$all"]
        }
      })
      this.codeType = data.code_type;
      this.startTime = moment(data.start_time).format("MM/DD/YYYY hh:mm")
      this.endTime = moment(data.end_time).format("MM/DD/YYYY hh:mm")
      this.code = data.code;
      this.content = data.content;
      this.limit = data.limit;
      this.amount = data.amount;
      this.qrCodeImage = data.qr_code_image;
      this.messengerCodeImage = data.messenger_code_image;
      this.link = data.link;
      this.isConnectChatbot = data.is_connect_chatbot;
    } catch (err) {
      this.backToList();
      console.log(err)
    }
  }

  editItem() {
    this.router.navigate(['../../add', this.id], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  async requireCreateSmartCodeOnChatbot() {
    try {
      let request = {
        smart_code_id: this.id
      }
      let response = await this.innowayApi.thirdpartyChatbot.requireCreateSmartCodeOnChatbot(request);
      this.integrateSmartCodeToChatbot({
        code: this.code,
        messenger_code_image: response.result.messengerCode,
        qr_code_image: response.qrUrl,
        link: response.link
      });
    } catch (err) {
      console.log(err)
    }
  }

  async integrateSmartCodeToChatbot(request: any) {
    try {
      let response = await this.innowayApi.thirdpartyChatbot.integrateSmartCodeToChatbot(request);
    } catch (err) {
      console.log(err)
    }
  }

}
