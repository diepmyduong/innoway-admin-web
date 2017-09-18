import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TextQuickReplyFormControl, TextQuickReplyValidateMessages} from './controls/text-quick-reply.control';
export const QuickRepliesItemFormGroup  = (fb: FormBuilder) => {
    return fb.group({
        title  : TextQuickReplyFormControl,
        content_type : ['',Validators.required],
        payload: [''],
        image_url: ['']
    },{ validator: (group) => {
        if (group.controls.content_type.value == 'text') {
            return Validators.required(group.controls.payload);
        }
        return null;
    }});
} 

export var QuickRepliesItemValidateMessages = {
    required    : 'Bắt buộc phải nhập',
    title        : TextQuickReplyValidateMessages
}