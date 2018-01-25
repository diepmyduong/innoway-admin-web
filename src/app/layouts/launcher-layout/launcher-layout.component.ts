import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { InnowayApiService } from 'app/services/innoway'

@Component({
  selector: 'app-launcher-layout',
  templateUrl: './launcher-layout.component.html',
  styleUrls: ['./launcher-layout.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class LauncherLayoutComponent implements OnInit {

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
      private ref: ChangeDetectorRef,
      toasterService: ToasterService,
      private zone: NgZone,
      public innowayApi: InnowayApiService
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
        Branch: ['$all', '$paranoid'],
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
      //         Branch: ['$all', '$paranoid'],
      //         topping_values: ['$all', '$paranoid']
      //       }],
      //       customer: ['$all'],
      //       activity: ['$all']
      //     }]
      //   });
      //   console.log("bambi: " + JSON.stringify(bill));
      // } catch (err) {

      // }
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
      this.innowayApi.innowayAuth.logout()
    }

    navigations = [
      {
        type: 'single',
        name: 'Công cụ',
        link: "./tool",
        icon: 'fa fa-wrench',
      }
    ];


}
