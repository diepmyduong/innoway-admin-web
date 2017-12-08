import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'app/services';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { InnowayApiService } from 'app/services/innoway'
import * as Console from 'console-prefix'
declare var swal: any;

@Component({
  selector: 'app-login-launcher',
  templateUrl: './login-launcher.component.html',
  styleUrls: ['./login-launcher.component.scss'],
  animations: [
    trigger('fade', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('* => *', animate('.5s'))
    ]),
  ]
})
export class LoginLauncherComponent implements OnInit {

  constructor(
    private auth: AuthService,
    public innowayApi: InnowayApiService
  ) { }

  email: string;
  password: string;
  brandName: string;
  submitting = false;

  get log() { return Console(`[Login Page]`).log }

  ngOnInit() {
  }

  async signIn(form: NgForm) {

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    if (form.valid) {
      try {
        let { email, password, brandName } = this;
        let user = await this.innowayApi.innowayAuth.loginEmailAndPassword(email, password, brandName)
        this.log('success', user)
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
            if(err.error.type === "Wrong brand") {
              this.alertAuthError("Cửa hàng không tồn tại")
            } else if(err.error.type === "Email not verified"){
              this.alertAuthError("Email của bạn chưa được xác thực. Vui lòng kiểm tra email.")
            } else {
              this.alertAuthError("Đăng nhập không thành công");
            }
            
        }
        this.submitting = false;
      }
    } else {
      this.alertFormNotValid();
      this.submitting = false;
    }
  }

  async alertFormNotValid(message = "") {
    return await swal({
      title: 'Nội dung nhập không hợp lệ',
      text: message,
      type: 'warning',
      showConfirmButton: false,
      timer: 1000,
    })
  }

  async alertAuthError(message = "") {
    return await swal({
      title: message,
      type: 'warning',
      showConfirmButton: false,
      timer: 1000,
    })
  }

  keyDownFunction(event, form: NgForm) {
    if (event.keyCode == 13) {
      this.signIn(form)
    }
  }

}
