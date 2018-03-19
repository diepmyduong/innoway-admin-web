import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
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
    public innowayApi: InnowayApiService,
    public router: Router
  ) { }

  email: string;
  password: string;
  brandCode: string;
  submitting = false;

  get log() { return Console(`[Login Page]`).log }

  async ngOnInit() {
    if (await this.innowayApi.innowayAuth.authenticated) {
      this.log('already login success', 'firebase token', this.innowayApi.innowayAuth.firebaseToken)
      this.toDashboard()
    } else {
      this.log('user not login')
    }
  }

  toDashboard() {
    this.router.navigate(["launcher"])
  }

  register() {
    this.router.navigate(["brand-register"])
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

}
