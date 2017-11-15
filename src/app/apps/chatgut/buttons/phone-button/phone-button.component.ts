import { Component, OnInit, Host, Input } from '@angular/core';
import { BaseButton } from '../button-container/base-button'
import { ButtonContainerComponent } from '../button-container/button-container.component'
@Component({
  selector: 'app-phone-button',
  templateUrl: './phone-button.component.html',
  styleUrls: ['./phone-button.component.scss']
})
export class PhoneButtonComponent extends BaseButton implements OnInit {

  @Input() phoneNumber: string
  constructor(
    @Host() container: ButtonContainerComponent
  ) { 
    super(container)
  }

  ngOnInit() {
  }

  async editPhoneNumber(){
    const phoneNumber = await this.container.getPhoneNumberDialog(this.button.payload)
    if(this.button.payload != phoneNumber) {
      this.button.payload = phoneNumber
      this.container.onButtonChange(this.index)
    }
  }

  async defaultAction() {
    super.defaultAction(this.button)
    this.editPhoneNumber()
  }

}
