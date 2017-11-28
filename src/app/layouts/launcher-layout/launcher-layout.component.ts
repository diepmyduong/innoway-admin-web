import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-launcher-layout',
  templateUrl: './launcher-layout.component.html',
  styleUrls: ['./launcher-layout.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class LauncherLayoutComponent implements OnInit {

  data: any = {
    feature: [
      {
        title: "Trang điều phối",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/super-admin/dashboard",
      }, {
        title: "Chi nhánh",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/branch-layout",
      },
      {
        title: "Nhân viên",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/employee-layout",
      }, {
        title: "Sản phẩm",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/product-layout",
      }, {
        title: "Người dùng",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/customer-layout",
      }, {
        title: "Đơn hàng",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/bill-layout",
      }, {
        title: "Khuyến mãi",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/promotion-layout",
      }, {
        title: "Phản hồi",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/feedback-layout",
      },{
        title: "Ticket",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
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
      },{
        title: "Phân tích",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/analyse-layout",
      },{
        title: "Khảo sát",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/survey-layout",
      },{
        title: "Sự kiện",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/event-layout",
      },{
        title: "Tích hợp AI",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-apiai-layout",
      }, {
        title: "Tích hợp KiotViet",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "/integrate-kiotviet-layout",
      },{
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
