import { Component, Inject, OnInit} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


@Component({
    selector: 'topping-dialog',
    template: `
        <h2 class="topping-name">Danh sách topping</h2>
        <div class="topping-wrapper">
            <div *ngFor="let item of toppings">
                <div class="topping-title">{{item.topping.name}}</div>
                <div class="topping-options">
                    <mat-radio-group *ngIf="!item.topping.is_select_multiple" [(ngModel)]="single_toppings_models[item.topping.id]" 
                    (ngModelChange)="singleToppingChanged($event, item.topping.id)">
                        <mat-radio-button class="row" *ngFor="let option of item.topping.values"
                        [value]="option">{{option.name}}</mat-radio-button>
                    </mat-radio-group>
                    <div *ngIf="item.topping.is_select_multiple">
                        <mat-checkbox class="row" *ngFor="let option of item.topping.values" [checked]="multiple_toppings_models[option.id]" 
                        (change)="multipleToppingChanged($event, option, item.topping.id)"
                        [value]="option.id">{{option.name}}</mat-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="topping-footer row">
            <div class="topping-total-price col-md-7">
                Tổng phí topping: {{totalPrice | accounting}}
            </div>
            <div class="topping-buttons col-md-5">
                <button class="btn-topping-confirm btn btn-md" (click)="onYesClick()">Lưu lại</button>
                <button class="btn-topping-cancel btn btn-md" (click)="onNoClick()">Thoát</button>
            </div>
        </div>
    `,
    styleUrls: ['./pos.component.scss'],
})
export class ToppingDialog implements OnInit {
    private _dimesionToggle = false;
    initialCount: number = 10;
    totalPrice: number = 0;
    selectedToppings: any[] = [];
    toppings: any[] = [];
    single_toppings_models: any = {};
    multiple_toppings_models: any = {};

    constructor(
        public dialogRef: MatDialogRef<ToppingDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.toppings = data.productToppings;
        this.selectedToppings = data.selectedToppings;
    }

    async ngOnInit() {
        console.log(this.data);
        this.selectedToppings.forEach(item => {
            if (item.type == 'single') {
                this.single_toppings_models[item.topping_id] = item.option;
            } else {
                this.multiple_toppings_models[item.option.id] = true;
            }
        });
        this.updateToppingPrice();
    }
    
    multipleToppingChanged(event, option, topping_id) {
        if (event.checked) {
            this.selectTopping(option, topping_id, 'multiple');
        } else {
            this.deselectToppingByOptionId(option.id);
        }
        this.updateToppingPrice();
        console.log(this.selectedToppings);
    }

    singleToppingChanged(event, topping_id) {
        this.deselectToppingByToppingId(topping_id);
        this.selectTopping(event, topping_id, 'single');
        this.updateToppingPrice();
    }

    selectTopping(option, topping_id, type) {
        this.selectedToppings.push({option, topping_id: topping_id, type: type});
    }

    deselectToppingByOptionId(id) {
        let pos = -1;
        this.selectedToppings.forEach((item, index) => {
            if (item.option.id == id) {
                pos = index;
            }
        })

        if (pos > -1) {
            this.selectedToppings.splice(pos, 1);
        }
    }
    
    deselectToppingByToppingId(topping_id) {
        let pos = -1;
        this.selectedToppings.forEach((item, index) => {
            if (item.topping_id == topping_id) {
                pos = index;
            }
        })

        if (pos > -1) {
            this.selectedToppings.splice(pos, 1);
        }
    }

    onYesClick() {
        let result = this.selectedToppings;

        this.dialogRef.close({ data: result });
    }

    onNoClick() {
        this.dialogRef.close();
    }

    updateToppingPrice() {
        this.totalPrice = 0;
        this.selectedToppings.forEach(item => {
            this.totalPrice += Number.parseInt(item.option.price);
        });
    }

    // togglePosition(): void {
    //     this._dimesionToggle = !this._dimesionToggle;

    //     if (this._dimesionToggle) {
    //         this.dialogRef
    //             .updateSize('500px', '500px')
    //             .updatePosition({ top: '25px', left: '25px' });
    //     } else {
    //         this.dialogRef
    //             .updateSize()
    //             .updatePosition();
    //     }
    // }
}