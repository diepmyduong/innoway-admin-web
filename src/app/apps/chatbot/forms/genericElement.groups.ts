import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ElementTextFormControl, ElementTextValidateMessages} from './controls/elementText.control';
export const GenericElementFormGroup  = (fb: FormBuilder) => {
    return fb.group({
        title  : ElementTextFormControl,
        subtitle : ElementTextFormControl,
        image_url: ['']
    });
} 

export var GenericElementValidateMessages = {
    required    : 'Bắt buộc phải nhập',
    title       : ElementTextValidateMessages,
    subtitle    : ElementTextValidateMessages
}