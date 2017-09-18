import { Validators,FormControl } from '@angular/forms';


export const UrlFormControl = [
    '', //Default value
    Validators.compose([
        Validators.pattern("https?://.+")
    ])
];

export var UrlValidateMessages = {
    pattern   : 'Đường dẫn không hợp lệ',
}