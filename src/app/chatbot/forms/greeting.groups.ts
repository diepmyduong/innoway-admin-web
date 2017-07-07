import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GreetingTextFormControl, GreetingTextValidateMessages } from './controls/greetingText.control';

export const GreetingFormGroup  = (fb: FormBuilder) => {
    return fb.group({
        text   : GreetingTextFormControl
    });
} 

export var GreetingValidateMessages = {
    required    : 'Bắt buộc phải nhập',
    text        : GreetingTextValidateMessages
}