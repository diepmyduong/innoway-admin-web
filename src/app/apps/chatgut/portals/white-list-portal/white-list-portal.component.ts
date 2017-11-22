import { Component, OnInit, HostBinding, Host, Input, ViewChild, NgZone, Output, EventEmitter } from '@angular/core';
import { BasePortal } from '../portal-container/base-portal'
import * as Portals from '../'
import * as Ajv from 'ajv'
declare var swal:any
@Component({
  selector: 'app-white-list-portal',
  templateUrl: './white-list-portal.component.html',
  styleUrls: ['./white-list-portal.component.scss']
})
export class WhiteListPortalComponent extends BasePortal implements OnInit {

  constructor(
    @Host() container: Portals.PortalContainerComponent,
    private zone: NgZone
  ) { 
    super(container)
    this.domains = ["http://google.com","https://google.com.vn"]
  }
  domains: string[]

  ngOnInit() {
  }

  async addDomain() {
    const url = await this.getDomainDialog()
    this.domains.push(url)
  }

  getDomainDialog(url?:string) {
    return swal({
      title: 'Tên miền',
      input: 'text',
      inputValue: url || "",
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      inputValidator: (result) => {
        return new Promise((resolve, reject) => {
          if (result) {
            const ajv = new Ajv()
            let valid = ajv.validate({ type: "string", format: 'url' }, result);
            if (!valid) {
              reject("Yêu cầu nhập đúng định dạng URL");
              return;
            }
            const found = this.domains.indexOf(result)
            if(found > -1) {
              reject("Tên miền đã tồn tại")
              return;
            }
            resolve()
          } else {
            reject('Phải nhập đường dẫn')
          }
        })
      }
    })
  }

  async editDomain(url:string) {
    const updatedUrl = await this.getDomainDialog(url)
    const found = this.domains.indexOf(url)
    this.domains[found] = updatedUrl
  }

  async removeDomain(url:string) {
    const found = this.domains.indexOf(url)
    this.domains.splice(found,1)
  }
 
}
