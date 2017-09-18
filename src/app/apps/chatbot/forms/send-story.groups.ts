import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TextMessageFormControl, TextMessageValidateMessages } from './controls/text-message.control';

export const SendStoryFormGroup  = (fb: FormBuilder) => {
    return fb.group({
        text   : TextMessageFormControl,
        story  : [''],
        type   : ['',Validators.required]
    },{ validator: (group) => {
        if (group.controls.type.value == 'text') {
            return Validators.required(group.controls.text);
        }
        if(group.controls.type.value == 'story') {
            return Validators.required(group.controls.story);
        }
        return null;
    }});
} 

export var SendStoryValidateMessages = {
    required    : 'Bắt buộc phải nhập',
    text        : TextMessageValidateMessages
}