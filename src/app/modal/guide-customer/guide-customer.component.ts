import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'guide-customer',
    styleUrls: ['./guide-customer.component.scss'],
    templateUrl: './guide-customer.component.html',
})
export class GuideCustomerDialog implements OnInit {

    info = {};

    constructor(
    public dialogRef: MatDialogRef<GuideCustomerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
      
    }

    onYesClick() {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
