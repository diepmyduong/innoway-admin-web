import { Injectable } from '@angular/core';
import { environment } from '@environments'
@Injectable()
export class InnowayConfigService {

  constructor() {
    this.config = {
      host: environment.innoway.host,
      version: environment.innoway.version,
      uiHost: environment.innoway.uiHost
    }
  }

  config: {
    host: string
    version: string,
    uiHost: string
  }

  apiUrl(path: string = "") {
    return `${this.config.host}/api/${this.config.version}/${path}`
  }

  // get brandName() {
  //   return localStorage.getItem('innoway.brandName')
  // }
  //
  // set brandName(value: string) {
  //   localStorage.setItem('innoway.brandName', value)
  // }

  get brandCode() {
    return localStorage.getItem('innoway.brandCode')
  }

  set brandCode(value: string) {
    localStorage.setItem('innoway.brandCode', value)
  }

}
