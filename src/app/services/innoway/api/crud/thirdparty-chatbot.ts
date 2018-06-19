import { CrudAPI, iCrud } from '../crud'
import { Globals } from './../../../../globals'
import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdPartyChatbot extends iCrud {
  app_id?: string,
  app_secret?: string,
  app_token?: string,
}

export class ThirdPartyChatbot extends CrudAPI<iThirdPartyChatbot> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'thirdparty_chatbot')
  }

  async connect(params: {
    app_id: string,
    app_secret: string
  }) {
    let { app_id, app_secret } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`connect_chatbot`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { app_id, app_secret }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async disconnect(params: {
    // app_id: string,
    // app_secret: string,
    thirdparty_chatbot_id: string
  }) {
    let { thirdparty_chatbot_id } = params;//app_id, app_secret,
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`disconnect_chatbot`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { thirdparty_chatbot_id }//app_id, app_secret,
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async getStories(params: {
    thirdparty_chatbot_id: string
  }) {
    let { thirdparty_chatbot_id } = params
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`get_stories`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { thirdparty_chatbot_id },
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async requireCreateSmartCodeOnChatbot(params: {
    thirdparty_chatbot_id: string,
    smart_code_id: string
  }) {
    let { smart_code_id, thirdparty_chatbot_id } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`require_create_smart_code_on_chatbot`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { smart_code_id, thirdparty_chatbot_id }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async integrateSmartCodeToChatbot(params: {
    code: string,
    messenger_code_image: string,
    qr_code_image: string,
    link: string,
    thirdparty_chatbot_id: string
  }) {
    let { code, messenger_code_image, qr_code_image, link, thirdparty_chatbot_id } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`integrate_smart_code_to_chatbot`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { code, messenger_code_image, qr_code_image, link, thirdparty_chatbot_id }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async sendStory(params: {
    story_id: string,
    thirdparty_chatbot_id: string,
    send_by: "all" | "phone" | "subcriber",
    send_to: string[]
  }) {
    let { story_id, thirdparty_chatbot_id, send_by, send_to } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`send_stories`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { story_id, thirdparty_chatbot_id, send_by, send_to }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  // {
  //   "send_by": "all",
  //   "send_to": [
  //
  //       "5a55a0eeff3f8cf2823b9b4f"
  //     ],
  //     "thirdparty_chatbot_id": "a5e08710-4940-11e8-bb1d-cb51287711c8",
  //   "type": "new_story",
  //   "stories": [
  //       {
  //         "type": "generic",
  //         "option": {
  //           "attachment": {
  //             "type": "template",
  //             "payload": {
  //               "template_type": "button",
  //               "text": "Bạn có thể thực hiện thanh toán online thông qua nút 'Thanh toán online' bên dưới hoặc đóng tiền tại bệnh viện khi đến khám bệnh. Cám ơn.",
  //               "buttons": [
  //                 {
  //                   "type": "web_url",
  //                   "url": "https://pay.vnpay.vn/vpcpay.html?vnp_Amount=1000000&vnp_BankCode=VISA&vnp_Command=pay&vnp_CreateDate=20180426110435&vnp_CurrCode=VND&vnp_IpAddr=58.186.6.44%2C%20172.31.94.172&vnp_Locale=vn&vnp_OrderInfo=%7B%22brand_id%22%3A%22c5258180-483b-11e8-8dd2-1d30777df6d2%22%2C%22bill_id%22%3A%22e5f23330-4940-11e8-bb1d-cb51287711c8%22%2C%22type%22%3A%22bill%22%7D&vnp_OrderType=topup&vnp_ReturnUrl=http%3A%2F%2Fmiorder.vn%2Fapi%2Fv1%2Fvnpay%2Freturn&vnp_TmnCode=MITEK004&vnp_TxnRef=dda9afcd-de7b-2f2b-6734-ecdf9c658bf8&vnp_Version=2&vnp_SecureHashType=MD5&vnp_SecureHash=d1f706f1217fce126fef43f40e7fee24",
  //                   "title": "Thanh toán online",
  //                   "webview_height_ratio": "full",
  //                   "messenger_extensions": true,
  //                   "webview_share_button": "hide"
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //   ]
  // }

  async sendButtonForPayment(params: {
    thirdparty_chatbot_id: string,
    subscribers: string[],
    payment_url: string
  }) {
    let { thirdparty_chatbot_id, subscribers, payment_url } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`send`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body:
      {
        "send_by": "subscriber",
        "send_to": subscribers,
        "thirdparty_chatbot_id": thirdparty_chatbot_id,
        "type": "new_story",
        "stories": [
          {
            "type": "generic",
            "option": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Bạn có thể thực hiện thanh toán online thông qua nút 'Thanh toán online' bên dưới hoặc đóng tiền tại bệnh viện khi đến khám bệnh. Cám ơn.",
                  "buttons": [
                    {
                      "type": "web_url",
                      "url": payment_url,
                      "title": "Thanh toán online",
                      "webview_height_ratio": "full",
                      "messenger_extensions": true,
                      "webview_share_button": "hide"
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async sendInvoiceToCustomer(params: {
    total_price: number,
    vat_fee: number,
    amount_of_sub_fee: number,
    amount_of_promotion: number,
    ship_fee: number,
    ship_method: string,
    created_at: string,
    code: string,
    address: string,
    customer_fullname: string,
    greeting: string,
    subscribers: string[],
    send_by: string,
    thirdparty_chatbot_id: string,
    subscriber_id: string
  }) {
    let { total_price, vat_fee, amount_of_sub_fee, amount_of_promotion,
      ship_fee, ship_method, created_at, code, address, customer_fullname, greeting,
      subscribers, send_by, thirdparty_chatbot_id, subscriber_id } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`send_invoice_to_customer`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: {
        total_price, vat_fee, amount_of_sub_fee, amount_of_promotion,
        ship_fee, ship_method, created_at, code, address, customer_fullname, greeting,
        subscribers, send_by, thirdparty_chatbot_id, subscriber_id
      }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }


  async sendSampleStory() {
    let setting = {
      url: "https://mfood-commerce-01.herokuapp.com/api/v1/send",
      method: "POST",
      headers: {
        app_id: "5a210a848284a72dec826876",
        app_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7fSwicm9sZSI6IndyaXRlIiwiZXhwIjoiMjAxNy0xMi0yMVQwODoxMzowNy42ODdaIn0.jn1r13SdJ3NZGzmsDU10L7d6Z0gjbGMZkAHHWHm9qrI",
      },
      json: true,
      body: {
        "type": "new_story",
        "story": [
          {
            "type": "text",
            "option": {
              "text": "Hello"
            }
          },
          {
            "type": "generic",
            "option": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": [
                    {
                      "title": "Welcome to Peter Hats",
                      "image_url": "https://petersfancybrownhats.com/company_image.png",
                      "subtitle": "We've got the right hat for everyone.",
                      "default_action": {
                        "type": "web_url",
                        "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
                        "webview_height_ratio": "tall"
                      },
                      "buttons": [
                        {
                          "type": "web_url",
                          "url": "https://petersfancybrownhats.com",
                          "title": "View Website"
                        },
                        {
                          "type": "postback",
                          "title": "Start Chatting",
                          "payload": "DEVELOPER_DEFINED_PAYLOAD"
                        }
                      ]
                    }
                  ]
                }
              }
            }
          },
          {
            "type": "generic",
            "option": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "receipt",
                  "recipient_name": "Stephane Crozatier",
                  "order_number": "12345678902",
                  "currency": "USD",
                  "payment_method": "Visa 2345",
                  "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
                  "timestamp": "1428444852",
                  "address": {
                    "street_1": "1 Hacker Way",
                    "street_2": "",
                    "city": "Menlo Park",
                    "postal_code": "94025",
                    "state": "CA",
                    "country": "US"
                  },
                  "summary": {
                    "subtotal": 75,
                    "shipping_cost": 4.95,
                    "total_tax": 6.19,
                    "total_cost": 56.14
                  },
                  "adjustments": [
                    {
                      "name": "New Customer Discount",
                      "amount": 20
                    },
                    {
                      "name": "$10 Off Coupon",
                      "amount": 10
                    }
                  ],
                  "elements": [
                    {
                      "title": "Classic White T-Shirt",
                      "subtitle": "100% Soft and Luxurious Cotton",
                      "quantity": 2,
                      "price": 50,
                      "currency": "USD",
                      "image_url": "http://petersapparel.parseapp.com/img/whiteshirt.png"
                    },
                    {
                      "title": "Classic Gray T-Shirt",
                      "subtitle": "100% Soft and Luxurious Cotton",
                      "quantity": 1,
                      "price": 25,
                      "currency": "USD",
                      "image_url": "http://petersapparel.parseapp.com/img/grayshirt.png"
                    }
                  ]
                }
              }
            }
          }
        ],
        "sendBy": "subscriber",
        "sendTo": [
          "5a278062c4bc429213bd6311"
        ]
      }
    }

    var res: any = await this.exec(setting);
    var row = res;
    return row;
  }

  async sendInvoiceToCustomerSample(params: {
    contentGreeting: {
      text: string,
    },
    contentReceipt: {
      total_price: number,
      vat_fee: number,
      amount_of_sub_fee: number,
      amount_of_promotion: number,
      ship_fee: number,
      ship_method: string,
      created_at: string,
      code: string,
      brand: any,
      branch: any,
      address: string,
      customer_fullname: string,
      product: any[]
    }
  }) {
    let { contentGreeting, contentReceipt } = params;
    let setting = {
      url: "https://mfood-commerce-01.herokuapp.com/api/v1/send",
      method: "POST",
      headers: {
        app_id: "5a210a848284a72dec826876",
        app_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7fSwicm9sZSI6IndyaXRlIiwiZXhwIjoiMjAxNy0xMi0yMVQwODoxMzowNy42ODdaIn0.jn1r13SdJ3NZGzmsDU10L7d6Z0gjbGMZkAHHWHm9qrI",
      },
      json: true,
      body: {
        "type": "new_story",
        "story": [
          {
            "type": "text",
            "option": {
              "text": contentGreeting.text //greeting
            }
          },
          {
            "type": "generic",
            "option": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "receipt",
                  "recipient_name": contentReceipt.customer_fullname.toString(),
                  "order_number": contentReceipt.code.toString(),
                  "currency": "VND",
                  "payment_method": "Tiền mặt & giao hàng", //tiền mặt + giao hàng/nhận tại cửa hàng
                  "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
                  "timestamp": "1428444852", //timestamp
                  "address": {
                    "street_1": contentReceipt.address.toString(),
                    "street_2": "",
                    "city": "Hồ Chí Minh",
                    "postal_code": "70000",
                    "state": "Hồ Chí Minh",
                    "country": "VN"
                  },
                  "summary": {
                    "subtotal": contentReceipt.amount_of_sub_fee,
                    "shipping_cost": contentReceipt.ship_fee,
                    "total_tax": contentReceipt.vat_fee,
                    "total_cost": contentReceipt.total_price
                  },
                  "adjustments": [ //if amount_of_promotion is not equal 0 => add amount_of_promotion; because amount value must be not equal 0
                    {
                      "name": "Khuyến mãi",
                      "amount": contentReceipt.amount_of_promotion != 0 ? contentReceipt.amount_of_promotion : 1
                    }
                  ],
                  "elements": []
                }
              }
            }
          }
        ],
        "sendBy": "subscriber", //subscriber or phone
        "sendTo": [
          "5a278062c4bc429213bd6311" //subscriber_id or phone_number
        ]
      }
    }

    let products: any[] = [];
    contentReceipt.product.forEach(data => {
      let item = {
        "title": data.title,
        "subtitle": data.subtitle,
        "quantity": data.quantity,
        "price": data.price,
        "currency": "VND",
        "image_url": data.image_url
      }

      let option: any = setting.body.story[1].option;
      if (option != null) {
        try {
          option.attachment.payload.elements.push(item);
        } catch (err) {

        }
      }
    })

    // setting.body[1].option.attachment.elements = products;
    console.log("request body", JSON.stringify(setting))
    var res: any = await this.exec(setting);
    var row = res;
    return row;
  }

  async sendMessageToCustomer(params: {
    content: string,
    media: any,
    app: {
      app_id: string,
      app_token: string,
    },
    send_by: string,
    send_to: string[],
    thirdparty_chatbot_id: string,
    subscriber_id: string
  }) {
    let { content, media, app, send_by, send_to, thirdparty_chatbot_id, subscriber_id } = params;
    let setting = {
      url: "https://mfood-commerce-01.herokuapp.com/api/v1/send",
      method: "POST",
      headers: {
        app_id: app.app_id,
        app_token: app.app_token,
      },
      json: true,
      body: {
        thirdparty_chatbot_id: thirdparty_chatbot_id,
        subscriber_id: subscriber_id,
        "type": "new_story",
        "story": [
          {
            "type": "text",
            "option": {
              "text": content
            }
          }
        ],
        "sendBy": send_by, //subscriber or phone
        "sendTo": send_to
      }
    }

    if (media && media.type && media.link) {
      let mediaContent: any = {
        "type": media.type,
        "option": {
          "attachment": {
            "type": media.type,
            "payload": {
              "url": media.link
            }
          }
        }
      }
      setting.body.story.push(mediaContent)
    }

    console.log("request body", JSON.stringify(setting))
    var res: any = await this.exec(setting);
    var row = res;
    return row;
  }

  async sendBillActivityToCustomer(params: {
    content: string,
    bill: any,
    chatbot: any,
    note: string
    send_by: string,
    send_to: string[],
    thirdparty_chatbot_id: string,
    subscriber_id: string
  }) {
    let { bill, content, chatbot, send_by, send_to, note, thirdparty_chatbot_id, subscriber_id } = params;
    let setting = {
      url: "https://mfood-commerce-01.herokuapp.com/api/v1/send",
      method: "POST",
      headers: {
        app_id: chatbot.app_id,
        app_token: chatbot.access_token,
      },
      json: true,
      body: {
        thirdparty_chatbot_id: thirdparty_chatbot_id,
        subscriber_id: subscriber_id,
        type: "new_story",
        story: [
          {
            type: "text",
            option: {
              text: content // null or not null
            }
          }
        ],
        sendBy: send_by, //subscriber or phone
        sendTo: send_to
      }
    }

    let contentBillActivity: any = {};

    if (bill.activity.action.indexOf("CANCEL") >= 0) {
      contentBillActivity = {
        "type": "text",
        "option": {
          "text": "Chào {{first_name}} {{last_name}} đơn hàng bạn vừa bị hủy." // null or not null
        }
      }
      setting.body.story.push(contentBillActivity)
    } else {
      contentBillActivity = {
        "type": "text",
        "option": {
          "text": "Chào {{first_name}} {{last_name}} đơn hàng bạn vừa chuyển sang trạng thái " + note, // null or not null
        }
      }
      setting.body.story.push(contentBillActivity)
    }

    console.log("request body", JSON.stringify(setting))
    var res: any = await this.exec(setting);
    var row = res;
    return row;
  }

  async sendProductToCustomer() {

  }

  async sendCategoryToCustomer() {

  }
}
