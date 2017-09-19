import { Validators,FormControl } from '@angular/forms';

var max = 640;

export const TextMessageFormControl = [
    '', //Default value
    Validators.compose([
        Validators.maxLength(max)
    ])
];

export var TextMessageValidateMessages = {
    maxlength   : 'Không thể nhiều hơn '+max+' ký tự',
}