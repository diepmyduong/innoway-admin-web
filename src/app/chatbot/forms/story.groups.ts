import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

export const StoryFormGroup  = (fb: FormBuilder) => {
    return fb.group({
        title  : ['',Validators.required]
    });
} 

export var StoryValidateMessages = {
    required    : 'Bắt buộc phải nhập'
}