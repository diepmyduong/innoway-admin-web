import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddPageInterface } from "app/apps/interface/addPageInterface";
import { ActivatedRoute, Router } from "@angular/router";
import { InnowayApiService } from "app/services/innoway";
import { NgForm } from "@angular/forms";
import { Globals } from "./../../../Globals"
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

//import * as stringee from 'video_call'

declare var innoway2: any
declare let swal: any
declare var StringeeClient: any
declare let $: any
declare let StringeeCall: any

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  providers: [Globals],
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, AddPageInterface {
  id: any;
  brand_ship_id: string;
  isEdit: boolean = false;
  submitting: boolean = false;

  allow_pick_at_store: boolean;
  allow_ship: boolean;
  ship_method: 'distance' | 'area';
  ship_methods: any[]
  ship_fee_per_km: string;

  numberMask = createNumberMask({
    prefix: '',
    suffix: ' đ'
  })

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private globals: Globals,
    public innowayApi: InnowayApiService) {
  }

  ngOnInit(): void {
    this.id = this.innowayApi.innowayAuth.innowayUser.brand_id
    if (this.id == null) {
      this.isEdit = false;
      this.setDefaultData();
    } else {
      this.isEdit = true;
    }

    if (this.isEdit) {
      this.setData();
    }

    this.getAuthorizationCodeUBER();
    this.detectConnectShipmentThirdparties();
  }

  setDefaultData() {

  }

  async setData() {
    try {
      let data = await this.innowayApi.brand.getItem(this.id, {
        local: false,
        query: {
          fields: ["$all", {
            brand_ship: ["$all"]
          }]
        }
      })
      this.brand_ship_id = data.brand_ship.id
      if (data.brand_ship.allow_pick_at_store == null) {
        data.brand_ship.allow_pick_at_store = false;
      }
      this.allow_pick_at_store = data.brand_ship.allow_pick_at_store
      if (data.brand_ship.allow_ship == null) {
        data.brand_ship.allow_ship = false;
      }
      this.allow_ship = data.brand_ship.allow_ship
      this.ship_method = data.brand_ship.ship_method
      if (data.brand_ship.ship_fee_per_km == null) {
        data.brand_ship.ship_fee_per_km = 0;
      }
      this.ship_fee_per_km = data.brand_ship.ship_fee_per_km

      this.ship_methods = this.globals.SHIP_METHODS;
      this.ship_method = this.ship_methods[0].code
    } catch (err) {
      try { await this.alertItemNotFound() } catch (err) { }
      console.log("ERRRR", err);
      this.backToList()
    }
  }

  backToList() {
    this.router.navigate(['./../detail'], { relativeTo: this.route });
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
      let { allow_pick_at_store, allow_ship, ship_method, ship_fee_per_km } = this;
      await this.innowayApi.brandShip.add({
        name, allow_pick_at_store, allow_ship,
        ship_method, ship_fee_per_km: this.globals.convertStringToPrice(ship_fee_per_km)
      })
      this.alertAddSuccess();
      form.reset();
      form.controls["status"].setValue(1);
    } else {
      this.alertFormNotValid();
    }
  }

  async updateItem(form: NgForm) {
    if (form.valid) {
      let { allow_pick_at_store, allow_ship, ship_method, ship_fee_per_km } = this;
      await this.innowayApi.brandShip.update(this.brand_ship_id, {
        allow_pick_at_store, allow_ship,
        ship_method, ship_fee_per_km: this.globals.convertStringToPrice(ship_fee_per_km)
      })
      this.alertUpdateSuccess();
      // form.reset();
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

  log(event: boolean) {
    console.log(`Accordion has been ${event ? 'opened' : 'closed'}`);
  }

  ghnEmail: string
  ghnPassword: string

  ghnEmailRegister: string
  ghnPasswordRegister: string
  ghnContactNameRegister: string
  ghnContactPhoneRegister: string


  ghtkEmail: string
  ghtkPassword: string

  ghtkNameRegister: string
  ghtkEmailRegister: string
  ghtkPasswordRegister: string
  ghtkAddressRegister: string
  ghtkProvinceRegister: string
  ghtkDistrictRegister: string
  ghtkPhoneRegister: string

  isEnableMCOM: boolean = false
  isEnableGHN: boolean = false
  isEnableGHTK: boolean = false
  isEnableUBER: boolean = false

  mainShipmentUnit: string

  async detectConnectShipmentThirdparties() {
    try {
      let response = await this.innowayApi.thirdpartyShipper.getList()
      console.log("detectConnectShipmentThirdparties", JSON.stringify(response))
      response.forEach(item => {
        switch (item.type) {
          case 'GHN': {
            this.isEnableGHN = true
            break
          }
          case 'GHTK': {
            this.isEnableGHTK = true
            break
          }
          case 'UBER_DELIVER': {
            this.isEnableUBER = true
            break
          }
          case 'MCOM': {
            this.isEnableMCOM = true
          }
        }
      })
    } catch (err) {
      console.log("detectConnectShipmentThirdparties", err)
    }
  }

  async setMainShipmentUnit(brandId, unit) {
    try {
      let data: any = this.innowayApi.innowayAuth.innowayUser
      let response = await this.innowayApi.brand.update(data.brand_id, {
        default_delivery_unit: this.mainShipmentUnit
      })
    } catch (err) {

    }
  }

  async connectUber() {
    try {
      window.open("https://login.uber.com/oauth/v2/authorize?client_id=gkxITQVeZ_7X_enw-pstzK4TIicEfpru&response_type=code&redirect_uri=https://crm.mcommerce.com.vn");
      console.log("connectUber")
    } catch (err) {
      console.log("connectUber", err)
    }
  }

  async getAuthorizationCodeUBER() {
    try {
      let response = await this.innowayApi.shipment.getAuthorizationCodeUBER();
      console.log("getAuthorizationCodeUBER", JSON.stringify(response))
    } catch (err) {
      console.log("getAuthorizationCodeUBER", err)
    }
  }

  async loginGHN() {
    try {
      let response = await this.innowayApi.shipment.loginGHN({
        email: this.ghnEmail,
        password: this.ghnPassword
      })
      console.log("loginGHN", JSON.stringify(response))
    } catch (err) {
      console.log("loginGHN", err)
    }
  }

  async registerGHN() {
    try {
      let response = await this.innowayApi.shipment.registerGHN({
        email: this.ghnEmailRegister,
        password: this.ghnPasswordRegister,
        contact_name: this.ghnContactNameRegister,
        contact_phone: this.ghnContactPhoneRegister
      })
      console.log("registerGHN", JSON.stringify(response))
    } catch (err) {
      console.log("registerGHN", err)
    }
  }

  async loginGHTK() {
    try {
      let response = await this.innowayApi.shipment.loginGHTK({
        email: this.ghtkEmail,
        password: this.ghtkPassword
      })
      console.log("loginGHTK", JSON.stringify(response))
    } catch (err) {
      console.log("loginGHTK", err)
    }
  }

  async registerGHTK() {
    try {
      let response = await this.innowayApi.shipment.registerGHTK({
        name: this.ghtkNameRegister,
        first_address: this.ghtkAddressRegister,
        province: this.ghtkProvinceRegister,
        district: this.ghtkDistrictRegister,
        tel: this.ghtkPhoneRegister,
        email: this.ghtkEmailRegister
      })
      console.log("registerGHTK", JSON.stringify(response))
    } catch (err) {
      console.log("registerGHTK", err)
    }

  }

  client: any;
  fromNumber: string = '+84901403819';
  call: any;
  access_token: string = "eeyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS0FtUDBMdUl3R2xTMUtzVVc4NTRubFRhcXNXUnFKOXotMTUyMDMzMjc2MyIsImlzcyI6IlNLQW1QMEx1SXdHbFMxS3NVVzg1NG5sVGFxc1dScUo5eiIsImV4cCI6MTUyMjkyNDc2MywidXNlcklkIjoiaHV5ZG4ifQ.b7lALNjj9tgflTnCYW_0i9mIeOlORHcz2cxoltsMEHY"

  initStringee() {
    this.client = new StringeeClient();

    this.client.connect(this.access_token);

    this.client.on('connect', function() {
      console.log('++++++++++++++ connected to StringeeServer');
    });

    this.client.on('authen', function(res) {
      console.log('authen', res);
      $('#loggedUserId').html(res.userId);
    });

    this.client.on('disconnect', function() {
      console.log('++++++++++++++ disconnected: ' + this.test);
    });

    this.client.on('incomingcall', function(incomingcall) {
      this.call = incomingcall;
      this.settingCallEvent(incomingcall);

      //			call.videoResolution = {width: 1280, height: 720};

      var answer = confirm('Incoming call from: ' + incomingcall.fromNumber + ', do you want to answer?');

      if (answer) {
        this.call.answer(function(res) {
          console.log('answer res', res);
        });
      } else {
        this.call.reject(function(res) {
          console.log('reject res', res);
        });
      }

      console.log('++++++++++++++ incomingcall', incomingcall);
    });
  };

  testMakeCall(videocall) {
    console.log('make call, videocall: ' + videocall);
    //				var videoCall = false;
    this.call = new StringeeCall(this.client, this.fromNumber, $('#callTo').val(), videocall);

    //	call.videoResolution = {width: 1280, height: 720};

    this.settingCallEvent(this.call);

    this.call.makeCall(function(res) {
      console.log('make call callback: ' + JSON.stringify(res));
    });
  }

  settingCallEvent(call1) {
    call1.on('addremotestream', function(stream) {
      // reset srcObject to work around minor bugs in Chrome and Edge.
      this.remoteVideo.srcObject = null;
      this.remoteVideo.srcObject = stream;
    });

    call1.on('addlocalstream', function(stream) {
      // reset srcObject to work around minor bugs in Chrome and Edge.
      this.localVideo.srcObject = null;
      this.localVideo.srcObject = stream;
    });

    call1.on('state', function(state) {
      console.log('state ', state);
      var reason = state.reason;
      $('#callStatus').html(reason);
    });

    call1.on('info', function(info) {
      console.log('on info:' + JSON.stringify(info));
    });
  }

  testHangupCall() {
    $('#remoteVideo').srcObject = null;

    this.call.hangup(function(res) {
      console.log('hangup res', res);
    });
  }

  upgradeToVideoCall() {
    this.call.upgradeToVideoCall();
  }


  switchVoiceVideoCall() {
    var info = { requestVideo: true };
    //	var info = true;
    this.call.sendInfo(info, function(res) {
      console.log('switchVoiceVideoCall', res);
    });
  }



  mute() {
    var muted = !this.call.muted;
    this.call.mute(muted);

    if (muted) {
      $('#muteBtn').html('Unmute');
    } else {
      $('#muteBtn').html('Mute');
    }
  }

  enableVideo() {
    var success;
    if (this.call.localVideoEnabled) {
      success = this.call.enableLocalVideo(false);
    } else {
      success = this.call.enableLocalVideo(true);
    }
    console.log('enableVideo result: ' + success);
  }

}
