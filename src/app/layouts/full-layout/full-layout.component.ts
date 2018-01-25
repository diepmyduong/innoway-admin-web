import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "app/services/innoway";
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
    public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    toasterService: ToasterService,
    private zone: NgZone
  ) {
    this.employee = this.innowayApi.innowayAuth.innowayUser;
    this.toasterService = toasterService;
  }

  async ngOnInit() {
    //this.subscribeTopicByFCM();
    console.log("bambi: " + JSON.stringify(this.employee));
  }

  async subscribeTopicByFCM() {
    // this.billChangeObservable = await this.billService.subscribe();
    // this.subscribers.bill = this.billChangeObservable.subscribe(data => {
    //   this.getDataBillChange(data.id);
    // });
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
    // try {
    //   let bill = await this.billService.get(id, {
    //     fields: ['$all', {
    //       activities: ['$all', {
    //         employee: ['$all']
    //       }],
    //       bill_ship_detail: ['$all'],
    //       items: ['$all', {
    //         product: ['$all', '$paranoid'],
    //         topping_values: ['$all', '$paranoid']
    //       }],
    //       customer: ['$all'],
    //       activity: ['$all']
    //     }]
    //   });
    //   console.log("bambi: " + JSON.stringify(bill));
    //   this.showBillContent(bill);
    // } catch (err) {

    // }
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
    this.innowayApi.innowayAuth.logout();
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
    // {
    //   type: 'single',
    //   name: 'Đăng ký',
    //   link: "./brand-register",
    //   icon: 'fa fa-user-plus',
    // },
    // {
    //   type: 'single',
    //   name: 'Công cụ',
    //   link: "./tool",
    //   icon: 'fa fa-wrench',
    // },
    {
      type: 'parent',
      name: 'Thương hiệu',
      icon: 'fa fa-star',
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
      name: 'Nhóm ngành',
      icon: 'fa fa-star',
      children: [
        {
          name: 'Thêm',
          link: "./brand-category/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./brand-category/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    // {
    //   type: 'parent',
    //   name: 'Loại thương hiệu',
    //   icon: 'fa fa-star',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./brand-type/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./brand-type/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Ký Quỹ',
    //   icon: 'fa fa-university',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./deposit/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./deposit/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Dịch vụ',
    //   icon: 'fa fa-th',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./service/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./service/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    {
      type: 'parent',
      name: 'Chi nhánh',
      icon: 'fa fa-star-o',
      children: [
        {
          name: 'Thêm',
          link: "./branch/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./branch/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    // {
    //   type: 'parent',
    //   name: 'Loại chi nhánh',
    //   icon: 'fa fa-star-o',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./branch-type/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./branch-type/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    {
      type: 'title',
      name: 'Quản lý',
    },
    {
      type: 'parent',
      name: 'Sản phẩm',
      icon: 'fa fa-cubes',
      children: [
        {
          name: 'Thêm',
          link: "./products/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./products/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại sản phẩm',
      icon: 'fa fa-cube',
      children: [
        {
          name: 'Thêm',
          link: "./category/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./category/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Trạng thái sản phẩm',
      icon: 'fa fa-info',
      children: [
        {
          name: 'Thêm',
          link: "./product-type/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./product-type/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Đơn vị',
      icon: 'fa fa-dot-circle-o',
      children: [
        {
          name: 'Thêm',
          link: "./unit/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./unit/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Topping',
      icon: 'fa fa-leaf',
      children: [
        {
          name: 'Thêm',
          link: "./topping/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./topping/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại topping',
      icon: 'fa fa-pagelines',
      children: [
        {
          name: 'Thêm',
          link: "./topping-type/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./topping-type/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    // {
    //   type: 'parent',
    //   name: 'Thuộc tính sản phẩm',
    //   icon: 'fa fa-certificate',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./attribute/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./attribute/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    {
      type: 'parent',
      name: 'Nhân viên',
      icon: 'fa fa-users',
      children: [
        {
          name: 'Thêm',
          link: "./employee/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./employee/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    // {
    //   type: 'parent',
    //   name: 'Loại nhân viên',
    //   icon: 'fa fa-user',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./employee-type/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./employee-type/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    {
      type: 'parent',
      name: 'Đơn hàng',
      icon: 'fa fa-file-text',
      children: [
        {
          name: 'Thêm',
          link: "./bill/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./bill/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    // {
    //   type: 'single',
    //   name: 'Lịch sử thanh toán',
    //   link: "./paid_history",
    //   icon: 'fa fa-history',
    // },
    // {
    //   type: 'single',
    //   name: 'POS',
    //   link: "../pos",
    //   icon: 'fa fa-product-hunt',
    // },
    {
      type: 'parent',
      name: 'Khách hàng',
      icon: 'fa fa-user-o',
      children: [
        {
          name: 'Thêm',
          link: "./customer/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./customer/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại khách hàng',
      icon: 'fa fa-user-o',
      children: [
        {
          name: 'Thêm',
          link: "./customer-type/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./customer-type/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Khuyến mãi',
      icon: 'fa fa-gift',
      children: [
        {
          name: 'Thêm',
          link: "./promotion/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./promotion/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Loại khuyến mãi',
      icon: 'fa fa-gift',
      children: [
        {
          name: 'Thêm',
          link: "./promotion-type/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./promotion-type/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    // {
    //   type: 'parent',
    //   name: 'Thông báo',
    //   icon: 'fa fa-exclamation-circle',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./notification/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./notification/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Loại thông báo',
    //   icon: 'fa fa-exclamation',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./notification-type/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./notification-type/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Phản hồi',
    //   icon: 'fa fa-commenting',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./feedback/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./feedback/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Tiêu chí phản hồi',
    //   icon: 'fa fa-commenting-o',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./feedback-rule/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./feedback-rule/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Danh sách đen',
    //   icon: 'fa fa-file',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./blacklist/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./blacklist/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Tiêu chí danh sách đen',
    //   icon: 'fa fa-files-o',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./blacklist-rule/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./blacklist-rule/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Bài viết',
    //   icon: 'fa fa-sticky-note',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./blog/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./blog/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Loại bài viết',
    //   icon: 'fa fa-sticky-note-o',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./blog-type/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./blog-type/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Thống kê',
    //   icon: 'fa fa-area-chart',
    //   children: [
    //     {
    //       name: 'Chi phí',
    //       link: "./statistic/add",
    //       icon: 'fa fa-money'
    //     },
    //     {
    //       name: 'Đơn hàng',
    //       link: "./statistic/add",
    //       icon: 'fa fa-file-text'
    //     },
    //     {
    //       name: 'Sản phẩm',
    //       link: "./statistic/add",
    //       icon: 'fa fa-cube'
    //     },
    //     {
    //       name: 'Nhân viên',
    //       link: "./statistic/add",
    //       icon: 'fa fa-user'
    //     },
    //     {
    //       name: 'Hoạt động',
    //       link: "./statistic/add",
    //       icon: 'fa fa-code-fork'
    //     },
    //   ]
    // },
    // {
    //   type: 'parent',
    //   name: 'Báo cáo',
    //   icon: 'fa fa-file-text-o',
    //   children: [
    //     {
    //       name: 'Chi phí',
    //       link: "./report/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Đơn hàng',
    //       link: "./report/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Sản phẩm',
    //       link: "./report/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Nhân viên',
    //       link: "./report/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Hoạt động',
    //       link: "./report/add",
    //       icon: 'fa fa-plus'
    //     },
    //   ]
    // },
    // {
    //   type: 'title',
    //   name: 'Tiện ích',
    // },
    // {
    //   type: 'single',
    //   name: 'Chatbot',
    //   link: "../mcommerce",
    //   icon: 'fa fa-android',
    // },
    {
      type: 'title',
      name: 'Hệ thống',
    },
    {
      type: 'parent',
      name: 'Smart Code',
      icon: 'fa fa-usd',
      children: [
        {
          name: 'Thêm',
          link: "./smart-code/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./smart-code/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'single',
      name: 'Thiết lập',
      link: "./settings/config",
      icon: 'fa fa-cog',
    },
    // {
    //   type: 'parent',
    //   name: 'Thời gian làm việc',
    //   icon: 'fa fa-clock-o',
    //   children: [
    //     {
    //       name: 'Thêm',
    //       link: "./schedule/add",
    //       icon: 'fa fa-plus'
    //     },
    //     {
    //       name: 'Danh sách',
    //       link: "./schedule/list",
    //       icon: 'fa fa-list-ul'
    //     }
    //   ]
    // },
    {
      type: 'parent',
      name: 'Khu vực',
      icon: 'fa fa-location-arrow',
      children: [
        {
          name: 'Thêm',
          link: "./area/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./area/list",
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Phí ship',
      icon: 'fa fa-usd',
      children: [
        {
          name: 'Xem',
          link: "./ship/detail",
          icon: 'icon-eye'
        },
        {
          name: 'Sửa',
          link: "./ship/add",
          icon: 'fa fa-edit'
        }
      ]
    },

  ];

}
