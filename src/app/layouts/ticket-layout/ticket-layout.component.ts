import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InnowayApiService } from "app/services/innoway";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Globals } from './../../globals';

@Component({
  selector: 'app-ticket-layout',
  providers: [Globals],
  templateUrl: './ticket-layout.component.html',
  styleUrls: ['./ticket-layout.component.scss']
})

export class TicketLayoutComponent implements OnInit {

  prefix = '/ticket-layout'

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
      Ticket: ['$all', '$paranoid'],
      topping_values: ['$all', '$paranoid']
    }],
    customer: ['$all'],
    activity: ['$all']
  }];

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
      name: 'Ticket',
      icon: 'fa fa-cube',
      children: [
        {
          name: 'Thêm',
          link: "./ticket/add",
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: "./ticket/list",
          icon: 'fa fa-list-ul'
        }
      ]
    }
  ];

  thirdparty = [
    {
      name: "Giao hàng tiết kiệm",
      code: "GHTK",
      type: "ship",
      url: "https://i.imgur.com/7VvbMLT.png",
      link: ""
    },
    {
      name: "Giao hàng nhanh",
      code: "GHN",
      type: "ship",
      url: "https://i.imgur.com/Pj6j4PM.png",
      link: ""
    },
    {
      name: "KiotViet",
      code: "KIOTVIET",
      type: "data",
      url: "https://i.imgur.com/TwRwpNh.png",
      link: ""
    },
    {
      name: "Haravan",
      code: "HARAVAN",
      type: "data",
      url: "https://i.imgur.com/yMSgiNK.png",
      link: ""
    },
    {
      name: "MCOM Bot",
      code: "MCOM",
      type: "bot",
      url: "https://i.imgur.com/7JRFS05.png",
      link: ""
    }
  ]

  goToDashboardLayout() {
    this.router.navigate(['/dashboard-layout'], { relativeTo: this.route });
  }

  goToCustomerLayout() {
    this.router.navigate(['/customer-layout'], { relativeTo: this.route });
  }

  goToEmployeeLayout() {
    this.router.navigate(['/employee-layout'], { relativeTo: this.route });
  }

  goToTicketLayout() {
    this.router.navigate(['/Ticket-layout'], { relativeTo: this.route });
  }

  goToPromotionLayout() {
    this.router.navigate(['/promotion-layout'], { relativeTo: this.route });
  }

  goToBillLayout() {
    this.router.navigate(['/bill-layout'], { relativeTo: this.route });
  }

  goToSettingLayout() {
    this.router.navigate(['/setting-layout'], { relativeTo: this.route });
  }

  goToPOSLayout() {
    this.router.navigate(['/pos'], { relativeTo: this.route });
  }

}
