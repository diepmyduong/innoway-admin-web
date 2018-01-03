import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {

  data: any = {
    feature: [
      {
        title: "Thiết lập",
        icon: "https://farm5.staticflickr.com/4521/38018892844_81b009a668_o.png",
        link: "/setting-layout",
      },
      {
        title: "Trang điều phối",
        icon: "https://farm5.staticflickr.com/4574/38018893524_94f1d2622b_o.png",
        link: "/dashboard-layout",
      }, {
        title: "Chi nhánh",
        icon: "https://farm5.staticflickr.com/4536/38018893464_2243305580_o.png",
        link: "/branch-layout",
      },
      {
        title: "Nhân viên",
        icon: "https://farm5.staticflickr.com/4533/38018893334_5e118b5f3f_o.png",
        link: "/employee-layout",
      }, {
        title: "Sản phẩm",
        icon: "https://farm5.staticflickr.com/4573/38018893214_d3fa023850_o.png",
        link: "/product-layout",
      }, {
        title: "Người dùng",
        icon: "https://farm5.staticflickr.com/4537/38018893194_f8e3a08b37_o.png",
        link: "/customer-layout",
      }, {
        title: "Đơn hàng",
        icon: "https://farm5.staticflickr.com/4567/38018893154_5db60221a1_o.png",
        link: "/bill-layout",
      }, {
        title: "Khuyến mãi",
        icon: "https://farm5.staticflickr.com/4585/38018893044_97c6c9f5ed_o.png",
        link: "/promotion-layout",
      }, {
        title: "POS",
        icon: "https://farm5.staticflickr.com/4528/24866458148_a12c9693af_o.png",
        link: "/pos",
      }, {
        title: "Phản hồi",
        icon: "https://farm5.staticflickr.com/4558/38018892994_1ef6928909_o.png",
        link: "/feedback-layout",
      }, {
        title: "Ticket",
        icon: "https://farm5.staticflickr.com/4586/37848509095_91f1c6899d_o.png",
        link: "/ticket-layout",
      }
    ],
    addon: [
      {
        title: "Thống kê",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/summary-layout",
      }, {
        title: "Báo cáo",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/report-layout",
      }, {
        title: "Phân tích",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/analyse-layout",
      }, {
        title: "Khảo sát",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/survey-layout",
      }, {
        title: "Sự kiện",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/event-layout",
      }, {
        title: "Tích hợp AI",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-apiai-layout",
      }, {
        title: "Tích hợp KiotViet",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-kiotviet-layout",
      }, {
        title: "Tích hợp Chatbot",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-chatbot-layout",
      }
    ]
  }

  constructor() { }

  ngOnInit() {

  }

}
