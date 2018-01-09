import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "app/services/innoway";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';

@Component({
  selector: 'app-product-layout',
  providers: [Globals],
  templateUrl: './product-layout.component.html',
  styleUrls: ['./product-layout.component.scss']
})

export class ProductLayoutComponent implements OnInit {

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
    this.subscribeTopicByFCM();
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
      type: 'parent',
      name: 'Sản phẩm',
      icon: 'fa fa-cube',
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
      icon: 'fa fa-cubes',
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
    {
      type: 'parent',
      name: 'Thuộc tính sản phẩm',
      icon: 'fa fa-certificate',
      children: [
        {
          name: 'Thêm',
          link: "./attribute/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./attribute/list",
          icon: 'fa fa-list-ul'
        }
      ]
    }
  ];

}
