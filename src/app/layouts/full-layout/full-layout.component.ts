import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AuthService, InnowayService } from "app/services";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';

@Component({
  selector: 'app-full-layout',
  providers: [Globals],
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent implements OnInit {

  prefix = '/super-admin'

  employee: any;
  branch: any;

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  billService: any;
  billActitivyService: any;
  billChangeObservable: Observable<any>;
  subscribers: any = {};

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig = new ToasterConfig({
    tapToDismiss: false,
    timeout: 2000
  });

  constructor(private router: Router,
    private route: ActivatedRoute,
    private innoway: InnowayService,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    toasterService: ToasterService,
    private auth: AuthService,
    private zone: NgZone
  ) {
    this.employee = this.auth.service.userInfo;
    this.toasterService = toasterService;
    this.billService = innoway.getService('bill');
  }

  async ngOnInit() {
    this.subscribeTopicByFCM();
    console.log("bambi: " + JSON.stringify(this.employee));
  }

  async subscribeTopicByFCM() {
    this.billChangeObservable = await this.billService.subscribe();
    this.subscribers.bill = this.billChangeObservable.subscribe(data => {
      this.getDataBillChange(data.id);
    });
  }

  itemFields: any = ['$all', {
    activities: ['$all', {
      employee: ['$all']
    }],
    bill_ship_detail: ['$all'],
    items: ['$all', {
      product: ['$all', '$paranoid'],
      topping_values: ['$all', '$paranoid']
    }],
    customer: ['$all'],
    activity: ['$all']
  }];

  async getDataBillChange(id: string) {
    try {
      let bill = await this.billService.get(id, {
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
          activity: ['$all']
        }]
      });
      console.log("bambi: " + JSON.stringify(bill));
      this.showBillContent(bill);
    } catch (err) {

    }
  }

  async showBillContent(bill) {
    this.zone.run(()=>{
      let toast = this.toasterService.pop('success', 'Đơn hàng: ' + bill.id, "Đơn hàng " + this.globals.detectNameCurrentActivityOnBill(bill.activity.action));
    })
  }


  showSuccess() {
    console.log("bambi showSuccess()");
    this.toasterService.pop('success', 'Success Toaster', 'This is toaster description');
    this.ref.detectChanges();
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
    alert(open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  logout() {
    this.auth.service.logout();
  }



  navigations = [
    {
      type: 'single',
      name: 'Trang điều hướng',
      link: "./dashboard",
      icon: 'fa fa-home',
    },
    {
      type: 'title',
      name: 'Dịch vụ',
    },
    {
      type: 'single',
      name: 'Đăng ký',
      link: "/brand-register",
      icon: 'icon-speedometer',
    },
    {
      type: 'single',
      name: 'tool',
      link: "/tool",
      icon: 'icon-speedometer',
    },
    {
      type: 'parent',
      name: 'Thương hiệu',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./brand/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./brand/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại thương hiệu',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./brand-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./brand-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Ký Quỹ',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./deposit/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./deposit/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Dịch vụ',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./service/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./service/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Chi nhánh',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./branch/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./branch/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại chi nhánh',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./branch-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./branch-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'title',
      name: 'Quản lý',
    },
    {
      type: 'parent',
      name: 'Sản phẩm',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./products/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./products/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại sản phẩm',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./categories/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./categories/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Trạng thái sản phẩm',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./product-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./product-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại sản phẩm',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./categories/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./categories/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại sản phẩm',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./product-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./product-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Đơn vị',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./unit/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./unit/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Topping',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./topping/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./topping/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại topping',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./topping-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./topping-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Thuộc tính sản phẩm',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./attribute/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./attribute/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Nhân viên',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./employee/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./employee/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại nhân viên',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./employee-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./employee-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Đơn hàng',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./bill/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./bill/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'single',
      name: 'Lịch sử thanh toán',
      link: "./paid-history",
      icon: 'icon-speedometer',
    },
    {
      type: 'single',
      name: 'POS',
      link: "/pos",
      icon: 'icon-speedometer',
    },
    {
      type: 'parent',
      name: 'Khách hàng',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./customer/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./customer/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại khách hàng',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./customer-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./customer-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Khuyến mãi',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./promotion/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./promotion/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại khuyến mãi',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./promotion-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./promotion-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Thông báo',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./notification/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./notification/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại thông báo',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./notification-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./notification-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Phản hồi',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./feedback/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./feedback/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Tiêu chí phản hồi',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./feedback-rule/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./feedbac-rule/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Danh sách đen',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./blacklist/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./blacklist/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Danh sách đen',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./blacklist-rule/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./blacklist-rule/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Bài viết',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./blog/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./blog/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại bài viết',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./blog-type/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./blog-type/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Thống kê',
      icon: 'icon-star',
      children: [
        {
          name: 'Chi phí',
          link: "./statistic/add",
          icon: 'icon-add'
        },
        {
          name: 'Đơn hàng',
          link: "./statistic/add",
          icon: 'icon-add'
        },
        {
          name: 'Sản phẩm',
          link: "./statistic/add",
          icon: 'icon-add'
        },
        {
          name: 'Nhân viên',
          link: "./statistic/add",
          icon: 'icon-add'
        },
        {
          name: 'Hoạt động',
          link: "./statistic/add",
          icon: 'icon-add'
        },
      ]
    },
    {
      type: 'parent',
      name: 'Báo cáo',
      icon: 'icon-star',
      children: [
        {
          name: 'Chi phí',
          link: "./report/add",
          icon: 'icon-add'
        },
        {
          name: 'Đơn hàng',
          link: "./report/add",
          icon: 'icon-add'
        },
        {
          name: 'Sản phẩm',
          link: "./report/add",
          icon: 'icon-add'
        },
        {
          name: 'Nhân viên',
          link: "./report/add",
          icon: 'icon-add'
        },
        {
          name: 'Hoạt động',
          link: "./report/add",
          icon: 'icon-add'
        },
      ]
    },
    {
      type: 'title',
      name: 'Tiện ích',
    },
    {
      type: 'single',
      name: 'Chatbot',
      link: "./chatbot",
      icon: 'fa fa-android',
    },
    {
      type: 'title',
      name: 'Hệ thống',
    },
    {
      type: 'single',
      name: 'Thiết lập',
      link: "./setting",
      icon: 'icon-speedometer',
    },
    {
      type: 'parent',
      name: 'Thời gian làm việc',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./schedule/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./schedule/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Khu vực',
      icon: 'icon-star',
      children: [
        {
          name: 'Thêm',
          link: "./area/add",
          icon: 'icon-add'
        },
        {
          name: 'Danh sách',
          link: "./area/list",
          icon: 'icon-menu'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Phí ship',
      icon: 'icon-star',
      children: [
        {
          name: 'Xem',
          link: "./schedule/add",
          icon: 'icon-eye'
        },
        {
          name: 'Sửa',
          link: "./schedule/list",
          icon: 'icon-pen'
        }
      ]
    },

  ];

}
