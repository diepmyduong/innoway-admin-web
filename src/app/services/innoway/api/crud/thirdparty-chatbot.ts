import { CrudAPI, iCrud } from '../crud'

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

  async getStories() {
    let setting = {
      method: 'GET',
      uri: this.apiUrl(`get_stories`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async requireCreateSmartCodeOnChatbot(params: {
    smart_code_id: string
  }) {
    let { smart_code_id } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`require_create_smart_code_on_chatbot`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { smart_code_id }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async integrateSmartCodeToChatbot(params: {
    code: string,
    messenger_code_image: string,
    qr_code_image: string,
    link: string
  }) {
    let { code, messenger_code_image, qr_code_image, link } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`integrate_smart_code_to_chatbot`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { code, messenger_code_image, qr_code_image, link }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  // async handleSmartcodeFromChatbot(params: {
  //   code: string,
  //   subscriber_id: string,
  // }) {
  //   let { code, subscriber_id } = params;
  //   let setting = {
  //     method: 'PUT',
  //     uri: this.apiUrl(`/handle_smart_code_from_chatbot`),
  //     headers: { //headers
  //       'User-Agent': 'Request-Promise',
  //       'access_token': this.api.innowayAuth.adminToken
  //     },
  //     json: true,
  //     body: { code, subscriber_id }
  //   }
  //   var res: any = await this.exec(setting);
  //   var row = res.results.object;
  //   return row;
  // }

  async sendStory(params: {
    story_id: string
  }) {
    let { story_id } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`send_stories`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { story_id }
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
    greeting: string
  }) {
    let { total_price, vat_fee, amount_of_sub_fee, amount_of_promotion,
      ship_fee, ship_method, created_at, code, address, customer_fullname, greeting } = params;
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
        ship_fee, ship_method, created_at, code, address, customer_fullname, greeting
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
  }) {
    let { content, media } = params;
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
              "text": content
            }
          },
          {
            "type": "template",
            "payload": {
              "template_type": "media",
              "elements": [
                {
                  "media_type": media.type,
                  "url": media.link
                }
              ]
            }
          }
        ],
        "sendBy": "subscriber", //subscriber or phone
        "sendTo": [
          "5a278062c4bc429213bd6311" //subscriber_id or phone_number
        ]
      }
    }

    console.log("request body", JSON.stringify(setting))
    var res: any = await this.exec(setting);
    var row = res;
    return row;
  }

  async sendPromotionToCustomer() {

  }

  async sendBillActivityToCustomer(params: {
    content: string,
    bill: any
  }) {
    let { bill, content } = params;
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
              "text": content // null or not null
            }
          }
        ],
        "sendBy": "subscriber", //subscriber or phone
        "sendTo": [
          "5a278062c4bc429213bd6311" //subscriber_id or phone_number
        ]
      }
    }

    let contentBillActivity: any = {};

    switch (bill.activity.action) {
      case "CANCEL": { //if bill was cancel
        contentBillActivity = {
          "type": "text",
          "option": {
            "text": "Chào {{first_name}} {{last_name}} đơn hàng bạn vừa bị hủy." // null or not null
          }
        }
        setting.body.story.push(contentBillActivity)
        break;
      }
      case "UPDATED": { //if bill was updated
        contentBillActivity = {
          "type": "text",
          "option": {
            "text": "Chào {{first_name}} {{last_name}} đơn hàng bạn vừa được cập nhật. {{first_name}} {{last_name}} có thể kiểm tra lại thông tin đơn hàng ở bên dưới." // null or not null
          }
        }
        let contentReceipt: any = {
          "type": "generic",
          "option": {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "receipt",
                "recipient_name": bill.customer_fullname.toString(),
                "order_number": bill.code.toString(),
                "currency": "VND",
                "payment_method": "Tiền mặt & giao hàng", //tiền mặt + giao hàng/nhận tại cửa hàng
                "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
                "timestamp": "1428444852", //timestamp
                "address": {
                  "street_1": bill.address.toString(),
                  "street_2": "",
                  "city": "Hồ Chí Minh",
                  "postal_code": "70000",
                  "state": "Hồ Chí Minh",
                  "country": "VN"
                },
                "summary": {
                  "subtotal": bill.amount_of_sub_fee,
                  "shipping_cost": bill.ship_fee,
                  "total_tax": bill.vat_fee,
                  "total_cost": bill.total_price
                },
                "adjustments": [ //if amount_of_promotion is not equal 0 => add amount_of_promotion; because amount value must be not equal 0
                  {
                    "name": "Khuyến mãi",
                    "amount": bill.amount_of_promotion != 0 ? bill.amount_of_promotion : 1
                  }
                ],
                "elements": []
              }
            }
          }
        }
        setting.body.story.push(contentBillActivity)
        setting.body.story.push(contentReceipt)
        break;
      }
      case "PROCESSING": {
        contentBillActivity = {
          "type": "text",
          "option": {
            "text": "Chào {{first_name}} {{last_name}} đơn hàng bạn đang được xử lý", // null or not null
          }
        }
        setting.body.story.push(contentBillActivity)
      }
      case "DELIVERY": {
        contentBillActivity = {
          "type": "text",
          "option": {
            "text": "Chào {{first_name}} {{last_name}} đơn hàng bạn đang được giao bởi nhân viên " + bill.employee, // null or not null
          }
        }
        setting.body.story.push(contentBillActivity)
      }
      case "PAID": {
        contentBillActivity = {
          "type": "text",
          "option": {
            "text": "Cám ơn {{first_name}} {{last_name}} đã sử dụng dịch vụ của " + bill.brand_name + ". Đơn hàng đã được thanh toán vào lúc " + bill.activity.created_at, // null or not null
          }
        }
        setting.body.story.push(contentBillActivity)
      }
      default: {
        contentBillActivity = {
          "type": "text",
          "option": {
            "text": "Chào {{first_name}} {{last_name}} đơn hàng bạn vừa chuyển sang trạng thái " + bill.action, // null or not null
          }
        }
        setting.body.story.push(contentBillActivity)
      }
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
