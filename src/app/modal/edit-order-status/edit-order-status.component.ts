import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'edit-order-status',
    styleUrls: ['./edit-order-status.component.scss'],
    templateUrl: './edit-order-status.component.html',
})
export class EditOrderStatusDialog implements OnInit {
    
    constructor(
    public dialogRef: MatDialogRef<EditOrderStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}