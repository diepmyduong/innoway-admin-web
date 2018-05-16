import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "../../../services/innoway";
import { Globals } from "../../../globals";
import { MatDialog } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-chatbot',
  providers: [Globals],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  appId: string;
  appSecret: string;
  appToken: string;
  story: string;
  stories: any[];
  bill: any;
  employee: any;
  botAppId: string;
  mainBotApp: string;

  botApp: string = null
  botApps: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(public innowayApi: InnowayApiService,
    private globals: Globals,
    private ref: ChangeDetectorRef,
    public zone: NgZone,
    public dialog: MatDialog) {
    this.employee = this.innowayApi.innowayAuth.innowayUser
  }

  async ngOnInit() {
    this.getAllConnectedBotApp();
  }

  // async detectIntegrationWithChatbot(brandId) {
  //   try {
  //     console.log(brandId)
  //     let data = await this.innowayApi.brand.getItem(brandId, {
  //       query: {
  //         fields: ['$all', {
  //           thirdparty_chatbots: ["$all"]
  //         }]
  //       }
  //     })
  //     console.log("bot apps", JSON.stringify(data))
  //     if (data.thirdparty_chatbots[1]) {
  //       this.botAppId = data.thirdparty_chatbots[1].id
  //       this.appId = data.thirdparty_chatbots[1].app_id
  //       this.appSecret = data.thirdparty_chatbots[1].app_secret
  //       this.appToken = data.thirdparty_chatbots[1].access_token
  //       this.getStories();
  //     } else {
  //
  //     }
  //
  //     console.log("chatbot", JSON.stringify(data))
  //   } catch (err) {
  //     console.log("chatbot", err)
  //   }
  // }

  async integrateToChatbotSystem() {
    try {
      let data: any = await this.innowayApi.thirdpartyChatbot.connect({
        app_id: this.appId,
        app_secret: this.appSecret
      })
      this.setDefaultData()
      this.getAllConnectedBotApp();
    } catch (err) {
      console.log("integrateToChatbotSystem", err);
    }
  }

  setDefaultData() {
    this.appId = null
    this.appSecret = null
    return {
      appId: this.appId,
      appSecret: this.appSecret
    }
  }

  async disconnectChatbotSystem(botApp: any) {
    try {
      console.log("disconnectChatbotSystem", JSON.stringify(botApp));
      let data: any = await this.innowayApi.thirdpartyChatbot.disconnect({
        thirdparty_chatbot_id: botApp.id
      })
      this.getAllConnectedBotApp();
      console.log("disconnectChatbotSystem", JSON.stringify(data));
    } catch (err) {
      console.log("disconnectChatbotSystem", err);
    }
  }

  async getStories() {
    try {
      let response = await this.innowayApi.thirdpartyChatbot.getStories({
        thirdparty_chatbot_id: this.botAppId
      });
      this.stories = response.rows;
      this.story = this.stories[0]._id;
      console.log("getStories", response);
    } catch (err) {

    }
  }

  async loadBillData() {
    try {
      let response = await this.innowayApi.bill.getList({
        query: {
          fields: ['$all', {
            activities: ['$all', {
              employee: ['$all']
            }],
            bill_ship_detail: ['$all'],
            items: ['$all', {
              product: ['$all', '$paranoid'],
              topping_values: ['$all', '$paranoid']
            }],
            customer: ['$all'],
            sub_fees: ['$all'],
            activity: ['$all', {
              employee: ['$all']
            }],
            paid_history: ['$all'],
            paid_historys: ['$all', {
              employee: ['$all']
            }],
            related_people: ['$all']
          }]
        }
      })
      this.bill = response[0];
      console.log("bill", JSON.stringify(response))
    } catch (err) {
      console.log(err)
    }
  }

  async sendMessage() {
    try {
      console.log("send story", JSON.stringify(this.story))
      let response = await this.innowayApi.thirdpartyChatbot.sendStory({
        story_id: this.story,
        thirdparty_chatbot_id: this.botAppId,
        send_by: "all",
        send_to: []
      });
      console.log("send message", JSON.stringify(response))
    } catch (err) {
      console.log("send message", err)
    }
  }

  formatBillCode(code): string {
    let output = "DH";
    for (let i of [0, 7 - code.length]) {
      output += "0";
    }
    output += code
    return output;
  }

  async getAllConnectedBotApp() {
    try {
      this.botApps.next(await this.innowayApi.thirdpartyChatbot.getList({
        query: {
          local: false,
          fields: ["$all"],
          filter: {
            brand_id: { $eq: this.employee.brand_id }
          }
        }
      }))
      this.botApp = null;
      this.detectAndCheckDefaultConnectedBotApp();
      this.ref.detectChanges();
      console.log("brand-id ", this.employee.brand_id)
      console.log("bot app", JSON.stringify(this.botApps.getValue()))
    } catch (err) {
      console.log(err)
    }
  }

  async detectAndCheckDefaultConnectedBotApp() {
    try {
      let data = await this.innowayApi.brand.getItem(this.employee.brand_id, {
        query: {
          fields: ['$all', {
            thirdparty_chatbots: ["$all"]
          }]
        }
      })

      if (!data.main_thirdparty_chatbot_id
        && this.botApps.getValue().length >= 0) {
        this.setDefaultConnectedBotApp(this.botApps.getValue()[0])
      } else {
        this.mainBotApp = data.main_thirdparty_chatbot_id;
      }

    } catch (err) {
      console.log("detectAndCheckDefaultConnectedBotApp", err)
    }
  }

  detectMainBotApp(botApp: string): boolean {
    return botApp === this.mainBotApp ? true : false;
  }

  async setDefaultConnectedBotApp(botApp: string) {
    try {
      console.log("setDefaultConnectedBotApp id", botApp);
      let response = await this.innowayApi.brand.update(this.employee.brand_id, {
        main_thirdparty_chatbot_id: botApp
      })
      this.getAllConnectedBotApp();
      console.log("setDefaultConnectedBotApp", JSON.stringify(response))
    } catch (err) {
      console.log("setDefaultConnectedBotApp", err)
    }
  }
}
