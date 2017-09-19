import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'app/services';

declare var swal:any;

@Component({
  selector: 'app-login-launcher',
  templateUrl: './login-launcher.component.html',
  styleUrls: ['./login-launcher.component.scss']
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
    this.submitting = true;
    if(form.valid){
      try {
        let { email, password} = this;
        let user = await this.auth.loginWithEmailAndPassword(email,password);
      }catch(err){
        console.error("ERROR",err);
      }
    }else{
      this.alertFormNotValid()
    }
    this.submitting = false;
  }

  async alertFormNotValid() {
    return await swal({
      title: 'Nội dung nhập không hợp lệ',
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
