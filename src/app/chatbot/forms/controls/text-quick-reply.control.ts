import { Validators,FormControl } from '@angular/forms';

var max = 20;

export const TextQuickReplyFormControl = [
    '', //Default value
    Validators.compose([
        Validators.maxLength(max)
    ])
];

export var TextQuickReplyValidateMessages = {
    maxlength   : 'Không thể nhiều hơn '+max+' ký tự',
}