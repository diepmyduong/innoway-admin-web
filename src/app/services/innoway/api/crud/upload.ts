import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iUpload extends iCrud {

}

export class Upload extends CrudAPI<iUpload> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'upload')
  }

  async uploadImage(file) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', "https://api.imgur.com/3/image", false);
    xhr.setRequestHeader("Authorization", "Client-ID d4de8224fa0042f");
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(file);
    let responseObject = JSON.parse(xhr.response)
    return responseObject.data
  }

}
