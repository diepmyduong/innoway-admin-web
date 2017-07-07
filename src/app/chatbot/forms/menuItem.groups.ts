import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UrlFormControl, UrlValidateMessages } from './controls/url.control';

export const MenuItemFormGroup  = (fb: FormBuilder) => {
    return fb.group({
        title  : ['',Validators.required],
        type   : ['',Validators.required],
        url    : UrlFormControl,
        payload: ['']
    },{ validator: (group) => {
        if (group.controls.type.value == 'web_url') {
            return Validators.required(group.controls.url);
        }
        if(group.controls.type.value == 'postback') {
            return Validators.required(group.controls.payload);
        }
        return null;
    }});
} 

export var MenuItemValidateMessages = {
    required    : 'Bắt buộc phải nhập',
    url        : UrlValidateMessages
}