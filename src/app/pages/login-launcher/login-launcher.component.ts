import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { InnowayApiService } from 'app/services/innoway'
import * as Console from 'console-prefix'
import { MapsAPILoader } from '@agm/core';
declare var swal: any;

@Component({
  selector: 'app-login-launcher',
  templateUrl: './login-launcher.component.html',
  styleUrls: ['./login-launcher.component.scss'],
})
export class LoginLauncherComponent implements OnInit {

  brandName: string = ''
  brandPhone: string = ''
  brandAddress: string = ''
  brandResCode: string = ''

  adminFullname: string = ''
  adminEmail: string = ''
  adminPhone: string = ''
  adminPassword: string = ''
  adminRepassword: string = ''

  brandCategory: string;
  brandCategories: any[] = [];

  status: number = 0;

  longitude: string;
  latitude: string;

  latitudeMap: number;
  longitudeMap: number;
  zoom: number;

  tab: 'business' | 'admin' = 'business'

  @ViewChild("addressInput")
  searchElementRef: ElementRef;
  
  constructor(
    public innowayApi: InnowayApiService,
    public router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private ref: ChangeDetectorRef
  ) { }

  email: string = ''
  password: string = ''
  brandCode: string = ''
  submitting = false;
  mode: 'login' | 'register' = 'login' 

  loginChecked:boolean = false

  get log() { return Console(`[Login Page]`).log }

  async ngOnInit() {
    if (await this.innowayApi.innowayAuth.authenticated) {
      this.log('already login success', 'firebase token', this.innowayApi.innowayAuth.firebaseToken)
      this.toDashboard()
    } else {
      this.log('user not login')
      this.loginChecked = true
      
      this.loadBrandCategories()
      this.setDefaultMap();
      this.setAutocompleteMap();
    }
  }

  toDashboard() {
    this.router.navigate(["launcher"])
  }

  async signIn(form: NgForm) {

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    if (form.valid) {
      try {
        let { email, password, brandCode } = this;
        let user = await this.innowayApi.innowayAuth.loginEmailAndPassword(email, password, brandCode)
        this.log('success', user)
        this.toDashboard()
        // let user = await this.auth.loginWithEmailAndPassword(email,password);
      } catch (err) {
        this.log(err.code)
        switch (err.code) {
          case "auth/argument-error":
            this.alertAuthError("Vui lòng nhập đầy đủ dữ liệu")
            break;
          case "auth/operation-not-allowed":
            this.alertAuthError("Phương thức đăng nhập này chưa được cho phép")
            break;
          case "auth/user-disabled":
            this.alertAuthError("Tài khoản này đã bị khoá")
            break;
          case "auth/invalid-email":
            this.alertAuthError("Định dạng Email không đúng")
            break;
          case "auth/user-not-found":
            this.alertAuthError("Tài khoản không tồn tại")
            break;
          case "auth/wrong-password":
            this.alertAuthError("Mật khẩu không đúng")
            break;
          default:
            this.log(err)
            console.log("login error", err)
            if (err.error.type === "Wrong brand") {
              this.alertAuthError("Cửa hàng không tồn tại")
            } else if (err.error.type === "Email not verified") {
              await this.checkEmailVerified()
            } else {
              // this.alertAuthError("Đăng nhập không thành công");
              await this.checkEmailVerified()
            }

        }
        this.submitting = false;
      }
    } else {
      if (this.brandCode.length == 0 || this.email.length == 0 || this.password.length == 0)
      {
        this.alertFormNotValid('Không được để trống các trường đăng nhập');
      } else {
        this.alertFormNotValid('Nhập sai định dạng')
      }
      this.submitting = false;
    }
  }

  async alertFormNotValid(message = "") {
    return await swal({
      title: 'Nội dung nhập không hợp lệ',
      text: message,
      type: 'warning',
      showConfirmButton: true
    })
  }

  async alertAuthError(message = "") {
    return await swal({
      title: 'Lỗi đăng nhập',
      text: message,
      type: 'warning',
      showConfirmButton: true
    })
  }

  keyDownFunction(event, form: NgForm) {
    event.stopPropagation()
    if (event.keyCode == 13) {
      this.signIn(form)
    }
  }

  checkEmailVerified() {
    return new Promise((resolve, reject) => {
      const firebaseUser = this.innowayApi.innowayAuth.firebaseUser
      if (!firebaseUser.emailVerified) {
        swal({
          title: 'Email chưa được xác thực',
          text: "Vui lòng kiểm tra lại họp thư",
          showCancelButton: true,
          confirmButtonText: 'Tôi chưa nhận được email',
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return this.innowayApi.innowayAuth.sendVerifyEmail()
          },
          allowOutsideClick: false
        }).then(() => {
          return swal({
            type: 'info',
            title: 'Email đã được gửi',
            text: `Email đã được gửi đén hộp thư ${firebaseUser.email}. Vui lòng kiểm tra lại hộp thư`
          })
        }).then(() => {
          this.innowayApi.innowayAuth.logout()
          reject()
        })
      } else {
        resolve(true)
      }
    })
  }

  setDefaultMap() {
    //set google maps defaults
    this.zoom = 8;
    this.latitudeMap = 39.8282;
    this.longitudeMap = -98.5795;
  }

  setAutocompleteMap() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"],
        componentRestrictions: { country: "vn" },
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.brandAddress = place.formatted_address;

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat().toString();
          this.longitude = place.geometry.location.lng().toString();

          this.latitudeMap = place.geometry.location.lat();
          this.longitudeMap = place.geometry.location.lng();
          this.zoom = 12;

          this.ref.detectChanges();
        });
      });
    });
  }

  async loadBrandCategories() {
    try {
      this.brandCategories = await this.innowayApi.brandCategory.getList({
        query: {
          fields: ["$all"],
          filter: {
            status: { $eq: 1 }
          }
        }
      })
      if (this.brandCategories) {
        this.brandCategory = this.brandCategories[0].id;
      }
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  async register(form: NgForm) {
    try {
      this.submitting = true;
      for (let control in form.controls) {
        form.controls[control].markAsDirty()
      }
      if (form.valid) {
        let request: any = {
          brand_name: this.brandName,
          brand_address: this.brandAddress,
          brand_phone: this.brandPhone,
          brand_code: this.brandResCode,
          brand_category_id: this.brandCategory,

          longitude: this.longitudeMap,
          latitude: this.latitudeMap,

          admin_fullname: this.adminFullname,
          admin_phone: this.adminPhone,
          admin_email: this.adminEmail,
          admin_password: this.adminPassword
        }
        try {
          let data = await this.innowayApi.brand.registerNewBrand(request)
          this.alertAddSuccess()
          this.login();
        } catch (err) {
          console.log(err)
          this.alertFormNotValid("Email hoặc Mã doanh nghiệp đã được tạo")
        }
      } else {
        this.alertFormNotValid("Vui lòng kiểm tra lại nội dung đã nhập")
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.submitting = false;
    }
  }

  async alertAddSuccess() {
    return swal({
      title: 'Đăng ký thành công',
      type: 'success',
    })
  }

  async alertAddFailed() {
    return swal({
      title: 'Đăng ký không thành công',
      type: 'error',
    })
  }

  login() {
    this.router.navigate(["login"])
  }


  keyPress(event: any) {
    const pattern = /[0-9a-z\+\-]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPressPhone(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPressBrandCode(event: any) {
    const pattern = /[0-9a-z]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
