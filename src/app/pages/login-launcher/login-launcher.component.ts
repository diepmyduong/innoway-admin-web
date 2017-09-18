import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

declare var swal:any;

@Component({
  selector: 'app-login-launcher',
  templateUrl: './login-launcher.component.html',
  styleUrls: ['./login-launcher.component.scss']
})
export class LoginLauncherComponent implements OnInit {

  constructor() { }

  email:string;
  password:string;

  ngOnInit() {
  }

  async signIn(form:NgForm){
    if(form.valid){

    }else{
      await this.alertFormNotValid()
    }
  }

  async alertFormNotValid() {
    return await swal({
      title: 'Nội dung nhập không hợp lệ',
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
