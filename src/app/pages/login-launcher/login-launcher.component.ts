import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'app/services';
import { trigger, state, style, transition, animate } from '@angular/animations';

declare var swal:any;

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
    private auth: AuthService
  ) { }

  email:string;
  password:string;
  submitting = false;

  ngOnInit() {
  }

  async signIn(form:NgForm){

    if (this.submitting)
    {
      return;
    }

    this.submitting = true;

    if(form.valid){
      try {
        let { email, password } = this;
        let user = await this.auth.loginWithEmailAndPassword(email,password);
      }catch(err){
        this.alertAuthError("Email hoặc mật khẩu không đúng.");
        this.submitting = false;
      }
    }else{
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

  async alertAuthError(message = ""){
    return await swal({
      title: message,
      type: 'warning',
      showConfirmButton: false,
      timer: 1000,
    })
  }

  keyDownFunction(event,form:NgForm) {
    if(event.keyCode == 13) {
      this.signIn(form)
    }
  }

}
