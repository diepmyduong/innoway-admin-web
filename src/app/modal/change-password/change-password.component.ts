import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'change-password',
  styleUrls: ['./change-password.component.scss'],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordDialog implements OnInit {

  info = {};
  isValid: boolean = false;
  password: string;
  repassword: string;
  error: string = null;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.data.inputs.forEach(e => {
      this.info[e.property] = e.current;
    });
    console.log(this.info);
  }

  validateInputData(data, input) {
    switch (input) {
      case "password":
        this.password = data;
        break;
      case "repassword":
        this.repassword = data;
        break;
    }
    if (this.password != null && this.repassword != null) {
      if (this.password.length >= 8) {
        if (this.password == this.repassword) {
          this.isValid = true;
          this.error=null;
        } else {
          this.isValid = false;
          this.error = "(Mật khẩu xác nhận không đúng)";
        }
      } else {
        this.isValid = false;
        this.error = "(Mật khẩu ít nhất 8 ký tự)";
      }
    } else {
      this.isValid = false;
      this.error=null;
    }
    console.log(data, input, this.isValid);
  }

  onYesClick() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
