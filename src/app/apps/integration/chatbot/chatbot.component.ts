import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "../../../services/innoway";
import { Globals } from "../../../globals";
import { MatDialog } from "@angular/material";

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

  constructor(public innowayApi: InnowayApiService,
    private globals: Globals,
    private ref: ChangeDetectorRef,
    public zone: NgZone,
    public dialog: MatDialog) {
    this.employee = this.innowayApi.innowayAuth.innowayUser
  }

  async ngOnInit() {
    // this.loadBillData();
    this.detectIntegrationWithChatbot(this.employee.brand_id)
  }

  async detectIntegrationWithChatbot(brandId) {
    try {
      console.log(brandId)
      let data = await this.innowayApi.brand.getItem(brandId, {
        query: {
          fields: ['$all', {
            thirdparty_chatbot: ["$all"]
          }]
        }
      })
      if (data.thirdparty_chatbot) {
        this.appId = data.thirdparty_chatbot.app_id
        this.appSecret = data.thirdparty_chatbot.app_secret
        this.appToken = data.thirdparty_chatbot.access_token
        this.getStories();
      } else {

      }

      console.log("chatbot", JSON.stringify(data))
    } catch (err) {
      console.log("chatbot", err)
    }
  }

  async integrateToChatbotSystem() {
    try {
      let data: any = await this.innowayApi.thirdpartyChatbot.connect({
        app_id: this.appId,
        app_secret: this.appSecret
      })
      this.getStories();
      // this.accessToken = data.access_token;
      // console.log("integrateToChatbotSystem", data);
    } catch (err) {

    }
  }

  async getStories() {
    try {
      let response = await this.innowayApi.thirdpartyChatbot.getStories();
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
        story_id: this.story
      });
      console.log("send message", JSON.stringify(response))
      // let response = await this.innowayApi.thirdpartyChatbot.sendSampleStory();
      // console.log("getStories", response);
    } catch (err) {
      console.log("send message", err)
    }
  }

  async sendReceiptTemplate() {
    try {
      let request = {
        contentGreeting: {
          text: "Hello {{first_name}} {{last_name}} :D"
        },
        contentReceipt: {
          total_price: this.bill.total_price,
          vat_fee: this.bill.total_price,
          amount_of_sub_fee: this.bill.amount_of_sub_fee,
          amount_of_promotion: this.bill.amount_of_promotion,
          ship_fee: this.bill.bill_ship_detail.fee,
          ship_method: "a",
          created_at: "a",
          code: this.formatBillCode(this.bill.code),
          brand: {
            name: "a"
          },
          branch: {
            name: "a"
          },
          address: this.bill.address,
          customer_fullname: "a",
          product: []
        }
      }

      let products = [];
      this.bill.items.forEach(item => {
        let data = {
          title: item.product.name,
          subtitle: item.product.name.short_description ? item.product.name.short_description : "không có",
          quantity: item.amount,
          price: item.total_price,
          currency: "VND",
          image_url: item.product.thumb
        }

        products.push(data)
      })

      request.contentReceipt.product = products;
      console.log("request", JSON.stringify(request))
      let response = await this.innowayApi.thirdpartyChatbot.sendInvoiceToCustomer(request);
      console.log("response", JSON.stringify(response))
    } catch (err) {
      console.log(err)
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
}
