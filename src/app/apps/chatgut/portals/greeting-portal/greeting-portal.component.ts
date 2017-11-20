import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import { PortalContainerComponent } from '../portal-container/portal-container.component'
import { NgForm } from '@angular/forms'
import { MatSlideToggleChange, MatSlideToggle, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material'
import { ChatbotApiService, iSetting } from 'app/services/chatbot'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as _ from 'lodash'
declare var swal:any
@Component({
  selector: 'app-greeting-portal',
  templateUrl: './greeting-portal.component.html',
  styleUrls: ['./greeting-portal.component.scss']
})
export class GreetingPortalComponent extends BasePortal implements OnInit {

  @Input() settingId: string
  @ViewChild('cardFrm', { read: NgForm }) cardFrm: NgForm
  @ViewChild('saveToggle', { read: MatSlideToggle }) saveToggle: MatSlideToggle
  @ViewChild('auto', {read: MatAutocomplete }) autoComplete: MatAutocomplete
  @ViewChild('autoTrigger', { read: MatAutocompleteTrigger}) autoTrigger: MatAutocompleteTrigger
  constructor(
    @Host() container: PortalContainerComponent,
    private zone: NgZone,
    public chatbotApi: ChatbotApiService
  ) {
    super(container)
  }
  settingState: iSetting
  setting: iSetting
  filteredOptions = new BehaviorSubject<any[]>([])

  async ngOnInit() {
    this.showLoading()
    let setting = await this.chatbotApi.setting.getItem(this.settingId, {
      local: true, reload: true
    })
    this.setting = _.merge({},setting)
    this.updateSettingState()
    this.hideLoading()
    
  }

  async ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(()=> {
      try {
        this.subscriptions.textChange =  this.cardFrm.controls['text'].valueChanges.subscribe((text) => {
          if(_.startsWith(_.last(_.words(text, /[^, ]+/g)), '{{')) {
            this.filteredOptions.next([{
              value: `${text.substr(text,text.lastIndexOf("{{"))} {{user_fist_name}}`,
              display: "First Name"
            },{
              value: `${text.substr(text,text.lastIndexOf("{{"))} {{user_last_name}}`,
              display: "Last Name"
            },{
              value: `${text.substr(text,text.lastIndexOf("{{"))} {{user_full_name}}`,
              display: "Full Name"
            }])
          } else {
            this.filteredOptions.next([])
          }
          
        })
      } catch (err) {
        this.ngAfterViewInit()
      }
      
    },1000)
  }

  updateSettingState() {
    this.settingState = _.merge({}, this.setting)
  }

  async onSave(formCtrl: NgForm, toggleChange: MatSlideToggleChange) {
    if (toggleChange.checked) {
      // Disable Change
      toggleChange.source.setDisabledState(true)
      formCtrl.form.disable()
      // Update Card
      this.showLoading()
      try {
        
        const setting = await this.chatbotApi.setting.update(this.setting._id, this.setting, { reload: true })
        await this.chatbotApi.page.activeSetting(setting._id)
        formCtrl.form.enable()
        this.resetForm(formCtrl, this.setting)
        this.updateSettingState()
      } catch (err) {
        swal("Không thể lưu", "Vui lòng thử lại sau", "warning")
        formCtrl.form.enable()
        this.resetForm(formCtrl, this.settingState)
      }
      this.hideLoading()

    }
  }

  resetForm(formCtrl: NgForm, setting: iSetting ) { 
    formCtrl.resetForm({
      text: setting.option[0].text
    })
  }

}
