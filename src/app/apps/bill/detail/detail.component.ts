import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayService, AuthService } from 'app/services'
import { Globals } from './../../../globals';
import { DetailPageInterface } from "app/apps/interface/detailPageInterface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

declare let swal: any;

@Component({
  selector: 'app-detail',
  providers: [Globals],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, DetailPageInterface {

  elRef: ElementRef;
  billService: any;
  id: string;
  item: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);;
  itemFields: any = ['$all'];
  employee: any;
  employeeType: any;
  thumbDefault: string = "http://www.breeze-animation.com/app/uploads/2013/06/icon-product-gray.png";;

  constructor(
    private globals: Globals,
    private route: ActivatedRoute,
    private router: Router,
    elRef: ElementRef,
    private ref: ChangeDetectorRef,
    public innoway: InnowayService,
    private auth: AuthService
  ) {
    this.elRef = elRef;
    this.billService = innoway.getService('bill');
    this.employee = this.auth.service.userInfo;
    this.setupUIFollowActor(this.employee);
  }

  private setupUIFollowActor(employee: any) {
    switch (employee.employee_type) {
      case this.globals.ACTORS[0].code: {//anonymous
        break;
      }
      case this.globals.ACTORS[1].code: {//customer
        break;
      }
      case this.globals.ACTORS[2].code: {//operator
        this.itemFields = ['$all', {
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
        break;
      }
      case this.globals.ACTORS[3].code: {//shipper
        break;
      }
      case this.globals.ACTORS[4].code: {//checker
        break;
      }
      case this.globals.ACTORS[5].code: {//manager
        this.itemFields = ['$all', {
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
        break;
      }
      case this.globals.ACTORS[6].code: {//admin
        this.itemFields = ['$all', {
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
        break;
      }
      case this.globals.ACTORS[7].code: {//super_admin
        this.itemFields = ['$all', {
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
        break;
      }
      default: {
        break;
      }
    }
  }

  async ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.setData()
    } else {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  async setData() {
    try {
      this.item = await this.billService.get(this.id, {
        fields: this.itemFields
      })
    } catch (err) {
      this.alertItemNotFound()
      this.backToList()
    }
  }

  printt() {
    let popupWin, printContents;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    printContents = this.elRef.nativeElement.querySelector("#print_content").innerHTML;
    popupWin.document.write(`
            <html>
                <head>
                    <title>Print tab</title>
                </head>
                <body onload="window.print();window.close()">${printContents}
                </body>
            </html>`
    );
    popupWin.document.close();
  }

  editItem() {
    this.router.navigate(['../../add', this.id], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    return swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }
}
