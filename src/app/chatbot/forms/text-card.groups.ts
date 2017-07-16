import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TextMessageFormControl, TextMessageValidateMessages } from './controls/text-message.control';

export const TextCardFormGroup  = (fb: FormBuilder) => {
    return fb.group({
        text   : TextMessageFormControl
    });
} 

export var TextCardValidateMessages = {
    required    : 'Bắt buộc phải nhập',
    text        : TextMessageValidateMessages
}