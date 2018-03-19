import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomValidators } from "ng2-validation/dist";
import { InnowayApiService } from 'app/services/innoway'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router, ActivatedRoute } from "@angular/router";
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../Globals"
import * as moment from 'moment';
import { escape } from "querystring";

declare let accounting: any;
declare let swal: any;
// declare var $: any;

@Component({
  selector: 'app-add',
  providers: [Globals],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  id: any;
  isEdit: boolean = false;
  submitting: boolean = false;

  dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/];

  limit: number = 0
  amount: number = 0
  code: string
  content: string
  startTime: string
  endTime: string
  codeType: string
  codeTypes: any[]
  entityId: string
  status: number = 1

  isPromotionCodeType: boolean = null
  isSelectedPromotion: boolean = false

  promotion: string = null
  promotions: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innowayApi: InnowayApiService) {

  }

  async ngOnInit() {
    this.setDefaultData()

    this.id = this.route.snapshot.params['id'];

    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }

    this.getPromotion();
  }

  setDefaultData() {
    this.codeTypes = this.globals.SMART_CODE_TYPES;
    this.codeType = null;
    this.startTime = moment(Date.now()).format("MM/DD/YYYY HH:mm");
    this.endTime = moment(Date.now()).add(1, 'days').format("MM/DD/YYYY HH:mm");
    this.code = null
    this.content = null
    this.limit = 0
    this.amount = 0
    this.status = 1
    if (this.promotions.getValue()[0]) {
      this.promotion = this.promotions.getValue()[0].id;
    }
    return {
      codeTypes: this.codeTypes,
      codeType: this.codeType,
      startTime: this.startTime,
      endTime: this.endTime,
      code: this.code,
      content: this.content,
      limit: this.limit,
      amount: this.amount,
      status: this.status,
      promotion: this.promotion
    }
  }

  async setData() {
    try {
      let data = await this.innowayApi.smartCode.getItem(this.id, {
        query: {
          fields: ["$all"]
        }
      })
      console.log("data", JSON.stringify(data))
      this.codeType = data.code_type;
      this.startTime = moment(data.start_time).format("MM/DD/YYYY hh:mm")
      this.endTime = moment(data.end_time).format("MM/DD/YYYY hh:mm")
      this.code = data.code;
      this.content = data.content;
      this.limit = data.limit;
      this.amount = data.amount;
      if (data.entity_id) {
        this.promotion = data.entity_id;
        this.isSelectedPromotion = true;
      } else {
        this.isSelectedPromotion = false;
      }
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

  async addItem(form: NgForm) {
    if (form.valid) {
      let { codeType, code, startTime, endTime, content, limit, amount, status, promotion } = this;
      let start_time = moment(this.startTime, "MM/DD/YYYY HH:mm").format();
      let end_time = moment(this.endTime, "MM/DD/YYYY HH:mm").format();
      let code_type = codeType;
      let entity_id = promotion;
      await this.innowayApi.smartCode.add({
        code_type, code, start_time, end_time, content, limit, amount, status, entity_id
      })

      this.alertAddSuccess();
      form.reset();
      form.resetForm(this.setDefaultData());
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { codeType, code, startTime, endTime, content, limit, amount, status, promotion } = this;
      let start_time = moment(this.startTime, "MM/DD/YYYY HH:mm").format();
      let end_time = moment(this.endTime, "MM/DD/YYYY HH:mm").format();
      let code_type = codeType;
      let entity_id = promotion;
      await this.innowayApi.smartCode.update(this.id, {
        code_type, code, start_time, end_time, content, limit, amount, status, entity_id
      })

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
      this.backToList();
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

  async requireCreateSmartCodeOnChatbot() {
    try {
      let request = {
        smart_code_id: this.id,
        thirdparty_chatbot_id: null
      }
      let response = await this.innowayApi.thirdpartyChatbot.requireCreateSmartCodeOnChatbot(request);
      this.integrateSmartCodeToChatbot({
        code: this.code,
        messenger_code_image: response.result.messengerCode,
        qr_code_image: response.qrUrl,
        link: response.link
      });
    } catch (err) {
      console.log(err)
    }
  }

  async integrateSmartCodeToChatbot(request: any) {
    try {
      let response = await this.innowayApi.thirdpartyChatbot.integrateSmartCodeToChatbot(request);
    } catch (err) {
      console.log(err)
    }
  }

  async getPromotion() {
    try {
      this.promotions.next(await this.innowayApi.promotion.getList({
        query: {
          fields: ["$all"]
        }
      }))
      this.promotion = null;//this.promotions.getValue()[0].id ? this.promotions.getValue()[0].id : null
      console.log("promotion", JSON.stringify(this.promotions))
    } catch (err) {
      console.log(err)
    }
  }

  onChangeCodeType(data) {
    if (data == 'promotion') {
      this.isPromotionCodeType = true;
    } else {
      this.isPromotionCodeType = false;
      this.isSelectedPromotion = false
      this.code = null
      this.limit = 0
      this.amount = 0
      this.startTime = moment(Date.now()).format("MM/DD/YYYY hh:mm");
      this.endTime = moment(Date.now()).add(1, 'days').format("MM/DD/YYYY hh:mm");
    }
    this.ref.detectChanges();
  }

  async onChangePromotion(promotionId) {
    console.log("onChangePromotion", promotionId);
    if (promotionId != null) {
      this.isSelectedPromotion = true
      try {
        console.log("id", promotionId)
        let data: any = await this.innowayApi.promotion.getItem(promotionId, {
          query: {
            fields: ["code", "limit", "amount", "start_date", "end_date"]
          }
        })
        console.log("data", data)
        this.code = data.code
        this.limit = data.limit
        this.amount = data.amount
        this.startTime = moment(data.start_date).format("MM/DD/YYYY hh:mm");
        this.endTime = moment(data.end_date).format("MM/DD/YYYY hh:mm");
      } catch (err) {

      }
    } else {
      this.isSelectedPromotion = false
      this.code = null
      this.limit = 0
      this.amount = 0
      this.startTime = moment(Date.now()).format("MM/DD/YYYY hh:mm");
      this.endTime = moment(Date.now()).add(1, 'days').format("MM/DD/YYYY hh:mm");
    }
  }

  async disconnectChatbot() {
    try {

    } catch (err) {

    }
  }
}
