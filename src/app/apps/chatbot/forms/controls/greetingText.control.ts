import { Validators,FormControl } from '@angular/forms';

var max = 160;

export const GreetingTextFormControl = [
    '', //Default value
    Validators.compose([
        Validators.maxLength(max)
    ])
];

export var GreetingTextValidateMessages = {
    maxlength   : 'Không thể nhiều hơn '+max+' ký tự',
}