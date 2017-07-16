import { Validators,FormControl } from '@angular/forms';

var max = 80;

export const ElementTextFormControl = [
    '', //Default value
    Validators.compose([
        Validators.required,
        Validators.maxLength(max)
    ])
];

export var ElementTextValidateMessages = {
    maxlength   : 'Không thể nhiều hơn '+max+' ký tự',
}