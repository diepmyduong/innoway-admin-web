import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AuthService, InnowayService } from "app/services";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';

@Component({
  selector: 'app-bill-layout',
  providers: [Globals],
  templateUrl: './bill-layout.component.html',
  styleUrls: ['./bill-layout.component.scss']
})

export class BillLayoutComponent implements OnInit {

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
      Branch: ['$all', '$paranoid'],
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
            Branch: ['$all', '$paranoid'],
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
    }
  ];

}
