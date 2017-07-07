import { Component, OnInit,Input, Output , EventEmitter  } from '@angular/core';
import { PageService } from '../../services/page.service';
import { FormBuilder , FormGroup} from '@angular/forms';
import { GreetingFormGroup, GreetingValidateMessages } from '../../forms/greeting.groups';

@Component({
  selector: 'app-greeting-portal',
  templateUrl: './greeting-portal.component.html',
  styleUrls: ['./greeting-portal.component.scss']
})
export class GreetingPortalComponent implements OnInit {

  @Input() stackIndex:number;
  @Output() onLoaded = new EventEmitter<any>();
  @Input() setting:any;
  @Input() page:any;

  public frmGreeting: FormGroup

  constructor(
    private fb: FormBuilder,
    private pageService: PageService
  ) { 

  }

  ngOnInit() {
    console.log("Setting",this.setting);
    this.frmGreeting = GreetingFormGroup(this.fb);
    this.frmGreeting.controls['text'].setValue(this.setting.data.text);
  }

  save(){
    if(this.frmGreeting.valid){
      this.setting.data.text = this.frmGreeting.controls["text"].value;
      this.pageService.activeSetting(this.page.access_token,{
        type: "greeting",
        setting: this.setting.data
      }).then(success =>{
        console.log("SUCCESS",success);
      })
    }
  }

}
