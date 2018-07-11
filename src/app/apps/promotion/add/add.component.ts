import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CustomValidators } from "ng2-validation/dist";
import { InnowayApiService } from 'app/services/innoway'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router, ActivatedRoute } from "@angular/router";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../Globals"
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { BaseChartDirective } from "ng2-charts";

import { JsonEditorComponent, JsonEditorOptions } from "angular4-jsoneditor/jsoneditor/jsoneditor.component";

declare let accounting: any;
declare let swal: any;
// declare var $: any;

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AddPageInterface {
  [name: string]: any;
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/];

  name: string;
  amount: number = 0;
  code: string;
  limit: number = 0;
  image: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  value: number = 0;
  customerType: string;
  isMustUseScanningCode: boolean = false;

  promotionType: 'discount_by_percent' | 'discount_by_price' | 'discount_by_gift';
  promotionTypes: any[];

  promotion: string;
  promotions: any[];

  status: number = 1;
  customerTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // promotionTypeData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  model: any;

  @ViewChild('quillEditor') quill: any;
  @ViewChild("fileUploader")
  fileUploader: ElementRef;

  @ViewChild("fileImportUploader")
  fileImportUploader: ElementRef;

  isUploadImage: boolean = false;
  closeImage: string = "https://d30y9cdsu7xlg0.cloudfront.net/png/55049-200.png";
  errorImage: string = "http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png";

  public description = '';

  public editorOptions: JsonEditorOptions;
  public data: any = {};
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService) {

    this.promotionTypes = this.globals.PROMOTION_TYPES;
    this.promotionType = this.promotionTypes[0].code;

    this.model = {
      method: "url"
    };

    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
  }

  changeText(event) {
    console.log("bambi change text: " + JSON.stringify(event));
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    await this.loadCustomerTypeData();

    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }

    this.summaryProduct();
    let employee = this.innowayApi.innowayAuth.innowayUser;
    this.summaryEmployee(employee.id);
    this.summaryCustomer("")

    BaseChartDirective.prototype.ngOnChanges = function(changes) {
      if (this.initFlag) {
        // Check if the changes are in the data or datasets
        if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets')) {
          if (changes['data']) {
            this.updateChartData(changes['data'].currentValue);
          }
          else {
            this.updateChartData(changes['datasets'].currentValue);
          }
          // add label change detection every time
          if (changes['labels']) {
            if (this.chart && this.chart.data && this.chart.data.labels) {
              this.chart.data.labels = changes['labels'].currentValue;
            }
          }
          this.chart.update();
        }
        else {
          // otherwise rebuild the chart
          this.refresh();
        }
      }
    };
  }

  ngAfterViewInit() {
    this.quill.quillEditor.getModule("toolbar").addHandler("image", () => this.selectLocalImage());
  }

  selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        this.saveToServer(file);
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

  async saveToServer(file: File) {
    this.innowayApi.upload.uploadImage(file).then(result => {
      this.insertToEditor(result.link)
    })
  }

  insertToEditor(url: string) {
    // push image url to rich editor.
      const range = this.quill.quillEditor.getSelection();
      this.quill.quillEditor.insertEmbed(range.index, 'image', url);
    }

  private pieChartColors = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.9)',
        'rgba(54, 162, 235, 0.9)',
        'rgba(255, 206, 86, 0.9)',
        'rgba(0, 255, 0, 0.9)',
        'rgba(102, 0, 204, 0.9)',
        'rgba(255, 128, 0, 0.9)'
      ]
    }
  ]

  setDefaultData() {
    this.status = 1;
    this.startDate = null;
    this.startDate = null;
    this.value = 0;
    this.limit = 0
    this.amount = 0;
    this.code = null;
    this.description = "";
    this.shortDescription = "";
    this.previewImage = null
    this.image = "";
    this.isMustUseScanningCode = false;
    this.promotionType = this.promotionTypes[0].code;
    if (this.customerTypeData.getValue()[0]) {
      this.customerType = this.customerTypeData.getValue()[0].id;
    }
    return {
      status: this.status,
      promotionType: this.promotionType,
      customerType: this.customerType,
      startDate: this.startDate,
      endDate: this.endDate,
      value: this.value,
      limit: this.limit,
      amount: this.amount,
      code: this.code,
      description: this.description,
      shortDescription: this.shortDescription,
      isMustUseScanningCode: this.isMustUseScanningCode,
      image: this.image,
      previewImage: this.previewImage
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.promotion.getItem(this.id, {
        query: {
          fields: ["$all", {
            customer_types: ["$all"]
          }]
        }
      })
      this.name = data.name
      this.amount = data.amount
      this.code = data.code
      this.limit = data.limit
      this.description = data.description
      this.shortDescription = data.short_description
      this.startDate = moment(data.start_date).format("MM/DD/YYYY hh:mm")
      this.endDate = moment(data.end_date).format("MM/DD/YYYY hh:mm")
      this.value = data.value
      this.customerType = data.customer_types[0].customer_type_id
      this.promotionType = data.promotion_type
      this.status = data.status
      this.image = data.image
      this.isMustUseScanningCode = data.is_must_use_scanning_code

    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  async loadPromotions() {
    try {
      this.promotions = await this.innowayApi.promotion.getList({
        query: {
          fields: ["$all"]
        }
      })
    } catch (err) {

    }
  }

  async loadCustomerTypeData() {
    try {
      this.customerTypeData.next(await this.innowayApi.customerType.getList({
        query: { fields: ["id", "name"] }
      }))
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
    }
  }

  backToListForAddNew() {
    this.router.navigate(['./../list'], { relativeTo: this.route });
  }

  backToList() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }

  alertItemNotFound() {
    swal({
      title: 'Không còn tồn tại',
      type: 'warning',
      timer: 2000
    })
  }

  alertAddSuccess() {
    return swal({
      title: 'Đã thêm',
      type: 'success',
      timer: 2000,
    })
  }

  alertUpdateSuccess() {
    return swal({
      title: 'Đã cập nhật',
      type: 'success',
      timer: 2000,
    })
  }

  alertFormNotValid() {
    return swal({
      title: 'Nội dung nhập không hợp lệ',
      type: 'warning',
      timer: 2000,
    })
  }

  alertAddFailed() {
    return swal({
      title: 'Thêm không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  alertUpdateFailed() {
    return swal({
      title: 'Cập nhật không thành công',
      type: 'warning',
      timer: 2000,
    })
  }

  detectDate(startDate: string, endDate: string): boolean {
    let result = false;
    let start = new Date(startDate);
    let end = new Date(endDate);
    let now = new Date(Date.now());
    if (start.toString().toLowerCase().indexOf("invalid") == -1
      && end.toString().toLowerCase().indexOf("invalid") == -1
      && end >= now && start <= end) {
      result = true;
    }
    return result;
  }

  async addItem(form: NgForm) {
    if (form.valid && this.detectDate(this.startDate, this.endDate)
      && ((this.promotionType == this.globals.PROMOTION_TYPES[1].code && this.value <= 100 && this.value > 0)
        || (this.promotionType == this.globals.PROMOTION_TYPES[0].code) && this.value > 0)) {
      let { name, amount, code, limit, shortDescription, description, value, status, image, isMustUseScanningCode } = this;
      let start_date = moment(this.startDate, "MM/DD/YYYY hh:mm").format();
      let short_description = shortDescription;
      let end_date = moment(this.endDate, "MM/DD/YYYY hh:mm").format();
      let customer_type_id = this.customerType;
      let promotion_type = this.promotionType;
      let is_must_use_scanning_code: boolean = this.isMustUseScanningCode;
      let request = {
        name, amount, code, limit, short_description, is_must_use_scanning_code, customer_type_id,
        description, start_date: new Date(start_date), end_date: new Date(end_date), value, promotion_type, status, image
      }
      console.log("request", request);
      let promotion = await this.innowayApi.promotion.createPromotion(request)

      // let customer_type_ids: string[] = [];
      // customer_type_ids.push(customer_type_id);
      // await this.innowayApi.promotion.addCustomerTypes(promotion.id, customer_type_ids);

      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid && this.detectDate(this.startDate, this.endDate)
      && ((this.promotionType == this.globals.PROMOTION_TYPES[1].code && this.value <= 100 && this.value > 0)
        || (this.promotionType == this.globals.PROMOTION_TYPES[0].code) && this.value > 0)) {
      let { name, amount, code, limit, shortDescription, description, value, status, image, isMustUseScanningCode } = this;
      let start_date = moment(this.startDate, "MM/DD/YYYY hh:mm").format();
      let short_description = shortDescription;
      let end_date = moment(this.endDate, "MM/DD/YYYY hh:mm").format();
      let customer_type_id = this.customerType;
      let promotion_type = this.promotionType;
      let is_must_use_scanning_code: boolean = this.isMustUseScanningCode;
      let promotion = await this.innowayApi.promotion.update(this.id, {
        name, amount, code, limit, short_description, is_must_use_scanning_code,
        description, start_date: new Date(start_date), end_date: new Date(end_date), value, customer_type_id, promotion_type, status, image
      })

      let customer_type_ids: string[] = [];
      customer_type_ids.push(customer_type_id);
      await this.innowayApi.promotion.updateCustomerType(promotion.id, customer_type_ids);

      this.alertUpdateSuccess();
      form.reset();
      this.backToList();
    } else {
      this.alertFormNotValid();
    }
  }

  async submitAndNew(form: NgForm) {
    console.log('submit', form);
    this.submitting = true;
    try {
      await this.addItem(form);
    } catch (err) {
      console.log("ERROR SUBMIT", err);
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async submitAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.addItem(form);
      this.backToListForAddNew();
    } catch (err) {
      this.alertAddFailed()
    } finally {
      this.submitting = false;
    }
  }

  async updateAndClose(form: NgForm) {
    this.submitting = true;
    try {
      await this.updateItem(form);
      this.backToList();
    } catch (err) {
      this.alertUpdateFailed();
    } finally {
      this.submitting = false;
    }
  }

  checkSelectMustUseScanningCode(event) {
    this.isMustUseScanningCode = event;
  }

  async onChangeImportFile(event) {
    let files = this.fileImportUploader.nativeElement.files
    let file = files[0];
    console.log("onChangeImportFile", file);
    try {
      let response = await this.innowayApi.product.import(file, {
        mode: "overwrite"
      })
      // this.upload(files)
      console.log("onChangeImportFile", response);
    } catch (err) {
      console.log("onChangeImportFile", err);
    }
  }

  async export() {
    try {
      let response: any = await this.innowayApi.product.export()
      this.downloadFile(response)
    } catch (err) {
      console.log("export", err);
    }
  }

  downloadFile(data) {
    let blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "Enterprise.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  upload(files: Array<File>) {
    this.makeFileRequest("https://api.imgur.com/3/image", [], files).then((result) => {
      console.log("upload", result);
    }, (error) => {
      console.error("upload", error);
    });
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("image", files[i]);
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open("POST", url, true);
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("authorization", "Client-ID d4de8224fa0042f");
      xhr.setRequestHeader("mimeType", "multipart/form-data");
      xhr.send(formData);
    });
  }

  async summaryEmployee(id: string) {
    try {
      let params = {
        start_time: "2017-01-01",
        end_time: "2018-12-12",
        is_show_activity: true,
        is_show_feedback: true,
      }
      let response = await this.innowayApi.summary.summaryEmployee(id, params);
      console.log("summaryEmployee", JSON.stringify(response))
    } catch (err) {

    }
  }

  async summaryCustomer(id: string) {
    try {
      let params = {
        start_time: "2017-01-01",
        end_time: "2018-12-12",
        is_show_promotion: true,
        is_show_feedback: true,
      }
      let response = await this.innowayApi.summary.summaryCustomer("e02694b0-f679-11e7-bdfd-35e19d6c47de", params);
      console.log("summaryCustomer", JSON.stringify(response))
    } catch (err) {

    }
  }

  async summaryProduct() {
    try {
      let params = {
        start_time: "2017-01-01",
        end_time: "2018-12-12",
        product_type_id: undefined,
        category_id: undefined,
        is_show_branch: true,
      }
      let response: any = await this.innowayApi.summary.summaryProduct(params);

      let max = 5;
      let data: Array<any> = new Array<any>();
      let labels: Array<any> = new Array<any>();
      let values: Array<number> = new Array<number>();
      let other: any = {
        label: 'Khác',
        value: 0
      };

      response.products.forEach((item, index) => {
        let percent: number = item.rate_about_quantity * 100;
        data.push({
          label: item.product_name,
          value: Math.round(percent).toFixed(2)
        })
      })

      data.sort(function(a, b) { return b.value - a.value });

      data.forEach((item, index) => {
        if (index >= max - 1) {
          other.value += Number.parseFloat(item.value)
        } else {
          values.push(Number.parseFloat(item.value))
          labels.push(item.label)
        }
      })

      values.push(other.value)
      labels.push(other.label)

      console.log("other", JSON.stringify(other));

      this.pieChartData.next(values)
      this.pieChartLabels.next(labels)

      console.log("values", JSON.stringify(values));

      this.ref.detectChanges()
    } catch (err) {
      console.log("summaryProduct", err);
    }
  }

  // public pieChartData: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>([]);
  // public pieChartLabels: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  // public pieChartType: string = 'pie';
  //
  // // events
  // public chartClicked(e: any): void {
  //   console.log(e);
  // }
  //
  // public chartHovered(e: any): void {
  //   console.log(e);
  // }

  async onChangeImageFile(event) {
    // this.startLoading()
    let files = this.fileUploader.nativeElement.files
    let file = files[0]
    try {
      let response = await this.innowayApi.upload.uploadImage(file)
      this.previewImage = response.link
      this.image = response.link
    } catch (err) {
      console.log("upload image", err)
    }
  }

  onImageError(event) {
    this.previewImage = this.errorImage;
  }

  onImageChangeData(event) {
    this.previewImage = event;
  }

  removeImage() {
    this.previewImage = undefined;
  }

}
