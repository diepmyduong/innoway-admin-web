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
        title: "Hệ thống",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Chi nhánh",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      },
      {
        title: "Nhân viên",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Sản phẩm",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Người dùng",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Đơn hàng",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Khuyến mãi",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Phản hồi",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      },{
        title: "Ticket",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }
    ],
    addon: [
      {
        title: "Thống kê",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Báo cáo",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      },{
        title: "Phân tích",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      },{
        title: "Khảo sát",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      },{
        title: "Sự kiện",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      },{
        title: "Tích hợp AI",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }, {
        title: "Tích hợp KiotViet",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      },{
        title: "Tích hợp Chatbot",
        icon: "https://addons.cdn.mozilla.net/static/img/developers/new-landing/publish-my-addon.png",
        link: "",
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
