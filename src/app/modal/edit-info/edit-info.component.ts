import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'edit-info',
  styleUrls: ['./edit-info.component.scss'],
  templateUrl: './edit-info.component.html',
})
export class EditInfoDialog implements OnInit {

  info = {};

  constructor(
    public dialogRef: MatDialogRef<EditInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.data.inputs.forEach(e => {
      this.info[e.property] = e.current;
    });
    console.log(this.info);
  }

  onYesClick() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
