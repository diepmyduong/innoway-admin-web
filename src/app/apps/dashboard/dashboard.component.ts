import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Subscription } from "rxjs/Subscription";
import { DashboardService } from "app/apps/dashboard/DashboardService";
import { Globals } from "./../../globals"
import { SelectComponent } from "ng2-select";
import { SharedDataService } from "./../../services/shared-data/shared-data.service";

import * as moment from 'moment';
declare let swal: any

@Component({
  templateUrl: 'dashboard.component.html',
  providers: [Globals],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public brandPrimary: string = '#20a8d8';
  public brandSuccess: string = '#4dbd74';
  public brandInfo: string = '#63c2de';
  public brandWarning: string = '#f8cb00';
  public brandDanger: string = '#f86c6b';

  employee: any;
  employeeData: any;
  branch: any = {};

  summary: any = {};
  filter: any;
  area: any;

  get billFilterInfo(): any {
    return this.sharedDataService.billFilterInfo;
  }
  set billFilterInfo(value: any) {
    this.sharedDataService.billFilterInfo = value;
  }

  get employees(): BehaviorSubject<any[]> {
    return this.sharedDataService.employees;
  }

  set employees(value: BehaviorSubject<any[]>) {
    this.sharedDataService.employees = value;
  }

  areas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  //employees: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  customerData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  customerNameData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  autocompleteCustomerData: Array<any> = new Array<any>();
  autocompleteCustomerNameData: Array<any> = new Array<any>();

  callLoadDailySummary: boolean = false;

  actions: any;

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
  new ToasterConfig({
    tapToDismiss: true,
    timeout: 5000
  });

  top_right_infos = [
    // {
    //   number: 78744,
    //   text: 'Khách hàng',
    // },
    // {
    //   number: 12333,
    //   text: 'Phản hồi',
    // },
    // {
    //   number: 8684234,
    //   text: 'Đơn hàng',
    // },
    // {
    //   number: 45654,
    //   text: 'Truy cập',
    // },
  ];

  sub_header_infos = [
    // {
    //   number: 56,
    //   text: 'THÀNH CÔNG',
    // },
    // {
    //   number: 23,
    //   text: 'ĐANG XỬ LÝ',
    // },
    // {
    //   number: 78,
    //   text: 'ĐÃ CHUẨN BỊ',
    // },
    // {
    //   number: 12,
    //   text: 'ĐANG GIAO',
    // },
    // {
    //   number: 411,
    //   text: 'THANH TOÁN',
    // },
    // {
    //   number: 19,
    //   text: 'ĐÃ HỦY',
    // },
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    public innowayApi: InnowayApiService,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    toasterService: ToasterService,
    private dashboardService: DashboardService,
    public sharedDataService: SharedDataService) {

    this.employeeData = this.innowayApi.innowayAuth.innowayUser
    this.toasterService = toasterService;

    //init actions
    this.actions = this.globals.getBillActivitiesOnDashboardLayout();
  }

  showSuccess() {
    this.toasterService.pop('success', 'Success Toaster', 'This is toaster description');
  }

  async ngOnInit() {
    //generate random values for mainChart
    for (var i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }

    // this.dashboardService.detectSelectedAction(5);
    console.log("bambi: employee " + this.employeeData.fullname);
    this.loadAreaData();
    this.loadEmployeeDataByBranchData();
    this.loadBranchByEmployeeData(this.employeeData.branch_id);
    // this.getSummaryInformation();
    this.loadDailySummary();
    this.subscribeLoadDailySummary();
  }

  async loadEmployeeDataByBranchData() {
    try {
      this.employees.next(await this.innowayApi.employee.getList({
        query: { fields: ["$all"] }
      }))
    } catch (err) {
      // try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadAreaData() {
    try {
      this.areas.next(await this.innowayApi.shipArea.getList({
        query: { fields: ["$all"] }
      }))
    } catch (err) {
      // try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadBranchByEmployeeData(branchId: string) {
    try {
      this.branch = await this.innowayApi.branch.getItem(branchId, {
        query: { fields: ["$all"] }
      })
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  // dropdown buttons
  public status: { isopen: boolean } = { isopen: false };
  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  //convert Hex to RGBA
  public convertHex(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    let rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return rgba;
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    { // grey
      backgroundColor: this.brandPrimary,
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend: boolean = false;
  public lineChart1Type: string = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: this.brandInfo,
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend: boolean = false;
  public lineChart2Type: string = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend: boolean = false;
  public lineChart3Type: string = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A'
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend: boolean = false;
  public barChart1Type: string = 'bar';

  // mainChart

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public mainChartElements: number = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public mainChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { //brandInfo
      backgroundColor: this.convertHex(this.brandInfo, 10),
      borderColor: this.brandInfo,
      pointHoverBackgroundColor: '#fff'
    },
    { //brandSuccess
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
      pointHoverBackgroundColor: '#fff'
    },
    { //brandDanger
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend: boolean = false;
  public mainChartType: string = 'line';

  // social box charts

  public socialChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public socialChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public socialChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public socialChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public socialChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public socialChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public socialChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public socialChartLegend: boolean = false;
  public socialChartType: string = 'line';

  public sparklineChartData1: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Clients'
    }
  ];
  public sparklineChartData2: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Clients'
    }
  ];

  public sparklineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public sparklineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public sparklineChartDefault: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#d1d4d7',
    }
  ];
  public sparklineChartPrimary: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandPrimary,
    }
  ];
  public sparklineChartInfo: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
    }
  ];
  public sparklineChartDanger: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
    }
  ];
  public sparklineChartWarning: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandWarning,
    }
  ];
  public sparklineChartSuccess: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
    }
  ];


  public sparklineChartLegend: boolean = false;
  public sparklineChartType: string = 'line';

  query: any = {};
  searchTimeOut: number = 250;
  searchRef: any;

  onSearch(e) {
    const key = e.target.value;
    if (this.searchRef) clearTimeout(this.searchRef);
    this.searchRef = setTimeout(() => {
      this.query.filter = {
        $or: {
          name: { $iLike: `%${key}%` },
          description: { $iLike: `%${key}%` },
        }
      }
      this.getItems();
    }, this.searchTimeOut);
  }

  async getItems() {
    // let query = Object.assign({
    //   fields: this.itemFields
    // }, this.query);
    // this.items = await this.innoway.getAll('bill', query);
    // this.itemCount = this.billService.currentPageCount;
    // this.ref.detectChanges();
    // return this.items;
  }

  private subscribeLoadDailySummary() {
    this.dashboardService.loadDailySummary.subscribe(
      data => {
        console.log("subscribeLoadDailySummary", data);
        this.callLoadDailySummary = data;
        if (this.callLoadDailySummary != null && this.callLoadDailySummary == true) {
          console.log("subscribeLoadDailySummary", "loadDailySummary");
          this.loadDailySummary();
        }
      });
  }

  onChangeEmployee(value) {
    this.dashboardService.updateEmployee(value);
  }

  onChangeArea(value) {
    this.dashboardService.updateArea(value);
  }

  onChangeBill(value) {
    this.dashboardService.updateBill(value);
  }

  onChangeAction(value) {
    this.dashboardService.updateAction(value);
  }

  onChangeCustomer(value) {
    this.dashboardService.updateCustomer(value);
  }

  onChangeCustomerName(value) {
    this.dashboardService.updateCustomerName(value);
  }

  public selected(value: any): void {
    this.onChangeEmployee(value);
    console.log('Selected value is: ' + value);
  }

  public selectedCustomer(value: any): void {
    this.autocompleteCustomerData.push(value);
    this.select.items = this.autocompleteCustomerData;
    this.onChangeCustomer(value);
    console.log('Selected value is: ' + value);
  }

  public selectedCustomerName(value: any): void {
    this.autocompleteCustomerNameData.push(value);
    this.nameSelect.items = this.autocompleteCustomerNameData;
    this.onChangeCustomerName(value);
    console.log('Selected value is: ' + JSON.stringify(value));
  }

  public removed(value: any): void {
    console.log('Removed value is: ' + JSON.stringify(value));
  }

  public refreshValue(value: any): void {
    // this.value = value;
    console.log("bambi customer 2: " + JSON.stringify(value));
  }

  public removedName(value: any): void {
    console.log('Removed value is: ' + JSON.stringify(value));
  }

  public refreshValueName(value: any): void {
    // this.value = value;
    console.log("bambi customer 2: " + JSON.stringify(value));
  }

  @ViewChild('customerSelect') select: SelectComponent;
  @ViewChild('customerNameSelect') nameSelect: SelectComponent;

  addToItems() {
    this.autocompleteCustomerData.push({ id: "", text: this.newItem });
    this.select.items = this.autocompleteCustomerData;
    this.select.active = [{ id: "4", text: this.newItem }];
    this.ref.detectChanges();
  }

  addToNameItems() {
    this.autocompleteCustomerNameData.push({ id: "", text: this.newNameItem });
    this.nameSelect.items = this.autocompleteCustomerNameData;
    this.nameSelect.active = [{ id: "4", text: this.newNameItem }];
    this.ref.detectChanges();
  }

  newItem: string = '';
  newNameItem: string = '';

  public onChangeInputCustomer(event) {
    this.newItem = event;
    console.log("bambi customer: " + JSON.stringify(event));
  }

  public onChangeInputCustomerName(event) {
    this.newNameItem = event;
    console.log("bambi customer: " + JSON.stringify(event));
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }

  async detectChangeSelect(event) {
    console.log("bambi bambi: " + JSON.stringify(event));
    let limit = 5;
    this.customerData.next(await this.innowayApi.customer.getList({
      query: {
        fields: ["$all"],
        limit: limit,
        filter: {
          phone: { $iLike: `%${event}%` }
        }
      }
    }))

    this.autocompleteCustomerData = new Array<any>();

    this.customerData.forEach(data => {
      let item: any = data;
      let tmp = {
        text: item.phone,
        id: item.id
      };
      this.autocompleteCustomerData.push(tmp);
    })
  }

  async detectChangeNameSelect(event) {
    console.log("bambi bambi: " + JSON.stringify(event));
    let limit = 5;
    this.customerNameData.next(await this.innowayApi.customer.getList({
      query: {
        fields: ["$all"],
        limit: limit,
        filter: {
          fullname: { $iLike: `%${event}%` }
        }
      }
    }))

    this.autocompleteCustomerNameData = new Array<any>();

    this.customerNameData.forEach(data => {
      let item: any = data;
      let tmp = {
        text: item.fullname,
        id: item.id
      };
      this.autocompleteCustomerNameData.push(tmp);
    })
  }

  refreshFilterValue() {

  }

  async getSummaryInformation() {
    try {
      let data = await this.innowayApi.bill.summaryBill({
        startTime: moment(Date.now()).format("YYYY-MM-DD"),
        endTime: moment(Date.now()).add(1, 'days').format('YYYY-MM-DD')
      })

      console.log("summary", JSON.stringify(data));
      this.summary = data;

      this.top_right_infos.push({
        number: data.total_of_pay_amount,
        text: "Tiền đã thu"
      });

      this.top_right_infos.push({
        number: data.total_of_remain_amount,
        text: "Tiền còn thiếu"
      });

      this.sub_header_infos.push({
        number: data.number_of_bill_sent_successfully,
        text: 'THÀNH CÔNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_processing,
        text: 'ĐANG XỬ LÝ',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_prepared,
        text: 'ĐÃ CHUẨN BỊ',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_delivering,
        text: 'ĐANG GIAO',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_paid,
        text: 'THÀNH CÔNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_cancel,
        text: 'ĐÃ HỦY',
      })

      // this.top_right_infos.push({
      //
      // });
      // alert(JSON.stringify(data));
    } catch (err) {

    }
  }

  async loadDailySummary() {
    try {
      let response: any = await this.innowayApi.dailySummary.getList({
        query: {
          fields: ["$all"],
          filter: {
            date: { $eq: moment(Date.now()).format("DD-MM-YYYY") }
          }
        }
      })

      console.log("daily summary", JSON.stringify(response));
      let data = response[0];
      this.top_right_infos = [];
      this.sub_header_infos = [];

      this.top_right_infos.push({
        number: data.pay_amount,
        text: "Tiền đã thu"
      });

      this.top_right_infos.push({
        number: data.remain_amount,
        text: "Tiền còn thiếu"
      });

      this.top_right_infos.push({
        number: data.number_of_customer,
        text: "Số khách hàng"
      });

      this.top_right_infos.push({
        number: data.number_of_customer_using_promotion,
        text: "Số khuyến mãi được dùng"
      });

      this.top_right_infos.push({
        number: data.number_of_bill,
        text: "Số đơn hàng"
      });

      this.sub_header_infos.push({
        number: data.number_of_sent_successfully_status,
        text: 'THÀNH CÔNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_distributed_status,
        text: 'ĐÃ ĐIỀU PHỐI',
      })

      this.sub_header_infos.push({
        number: data.number_of_waiting_for_confirmation_status,
        text: 'ĐANG CHỜ XÁC NHẬN',
      })

      this.sub_header_infos.push({
        number: data.number_of_bill_confirmed_status,
        text: 'ĐÃ XÁC NHẬN',
      })

      this.sub_header_infos.push({
        number: data.number_of_picking_up_status,
        text: 'ĐANG LẤY HÀNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_received_status,
        text: 'ĐÃ NHẬN HÀNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_processing_status,
        text: 'ĐANG XỬ LÝ',
      })

      this.sub_header_infos.push({
        number: data.number_of_prepared_status,
        text: 'ĐÃ CHUẨN BỊ',
      })

      this.sub_header_infos.push({
        number: data.number_of_sent_shipper_status,
        text: 'ĐÃ GỬI GIAO HÀNG',
      })

      this.sub_header_infos.push({
        number: data.number_of_delivering_status,
        text: 'ĐANG GIAO',
      })

      this.sub_header_infos.push({
        number: data.number_of_paid_status,
        text: 'ĐÃ THANH TOÁN',
      })

      this.sub_header_infos.push({
        number: data.number_of_collected_money_status,
        text: 'ĐÃ NHẬN TIỀN',
      })

      this.sub_header_infos.push({
        number: data.number_of_cancelled_status,
        text: 'ĐÃ HỦY',
      })

      this.ref.detectChanges();
    } catch (err) {
      console.log("bi-summary", err)
    }
  }
}
